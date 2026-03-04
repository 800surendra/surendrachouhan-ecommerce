"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import { generateInvoice } from "../lib/generateInvoice";
interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: Timestamp;
  status: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const orderList: Order[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Order, "id">),
      }));

      setOrders(orderList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, router]);

  if (!user) return null;

  const cancelOrder = async (id: string) => {
    await updateDoc(doc(db, "orders", id), {
      status: "Cancelled",
    });
  };

  const getProgressWidth = (status: string) => {
    if (status === "Pending") return "33%";
    if (status === "Processing") return "50%";
    if (status === "Shipped") return "75%";
    if (status === "Delivered") return "100%";
    return "0%";
  };

  const getProgressColor = (status: string) => {
    if (status === "Delivered") return "bg-green-500";
    if (status === "Shipped") return "bg-blue-500";
    if (status === "Processing") return "bg-yellow-500";
    return "bg-gray-500";
  };

  const filteredOrders = orders.filter((order) =>
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      <h1 className="text-4xl font-bold text-center mb-12">
        📦 My Orders
      </h1>

      {/* Search */}
      <div className="max-w-xl mx-auto mb-12">
        <input
          type="text"
          placeholder="Search by Order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 p-4 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-400 animate-pulse">
          Loading your orders...
        </p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-10">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-yellow-500/10 transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                  <p className="text-gray-300 font-semibold">
                    Order ID: {order.id}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {order.createdAt?.toDate().toLocaleString()}
                  </p>
                  <button
onClick={() => generateInvoice(order)}
className="mt-4 bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300"
>
Download Invoice
</button>
                </div>

                <span className={`px-4 py-1 rounded-full text-sm font-semibold
                  ${order.status === "Delivered" ? "bg-green-600/20 text-green-400" :
                    order.status === "Shipped" ? "bg-blue-600/20 text-blue-400" :
                    order.status === "Cancelled" ? "bg-red-600/20 text-red-400" :
                    "bg-yellow-600/20 text-yellow-400"
                  }`}>
                  {order.status}
                </span>
                <Link
  href={`/track/${order.id}`}
  className="text-yellow-400 hover:underline mt-2 block"
>
  Track Order
</Link>
              </div>

              {/* Progress */}
              {order.status !== "Cancelled" && (
                <div className="mb-6">
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 transition-all duration-500 ${getProgressColor(order.status)}`}
                      style={{ width: getProgressWidth(order.status) }}
                    />
                  </div>
                </div>
              )}

              {/* Total + Expand */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-white">
                  ₹{order.total}
                </span>

                <button
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                  className="text-sm text-yellow-400 hover:underline"
                >
                  {expanded === order.id ? "Hide Details" : "View Details"}
                </button>
              </div>

              {/* Details */}
              {expanded === order.id && (
                <div className="space-y-3 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between bg-gray-800 p-3 rounded-lg"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}

                  <div className="flex gap-4 mt-4">

                    {(order.status === "Pending" ||
                      order.status === "Processing") && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="bg-red-500 px-5 py-2 rounded-full hover:bg-red-600 transition"
                      >
                        Cancel Order
                      </button>
                    )}

                    <button
                      onClick={() =>
                        window.open(`/invoice/${order.id}`, "_blank")
                      }
                      className="bg-yellow-400 text-black px-5 py-2 rounded-full hover:bg-yellow-300 transition"
                    >
                      Download Invoice
                    </button>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}