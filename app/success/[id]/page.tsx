"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // wait for auth

    const fetchOrder = async () => {
      try {
        const ref = doc(db, "orders", params.id as string);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          router.push("/");
          return;
        }

        setOrder({ id: snap.id, ...snap.data() });
      } catch (error) {
        console.error("Error loading order:", error);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, router, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Checking authentication...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading Order...
      </div>
    );
  }

  if (!order) return null;

  const items = order.items || [];

  const subtotal = items.reduce(
    (sum: number, item: any) =>
      sum + Number(item.price) * Number(item.quantity),
    0
  );

  const deliveryFee = Number(order.deliveryFee) || 0;
  const total = subtotal + deliveryFee;

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">
      <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl p-12 shadow-2xl">

        <div className="text-center mb-12">
          <div className="text-6xl mb-4 text-green-400">✅</div>

          <h1 className="text-4xl font-bold">
            Payment Submitted Successfully
          </h1>

          <p className="text-gray-400 mt-4">
            Your payment is under verification.
          </p>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl">
          <p className="text-gray-400 text-sm">Order ID</p>
          <p className="text-yellow-400 text-xl font-bold mb-6">
            {order.id}
          </p>

          <div className="space-y-3">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.title} × {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 space-y-2 text-right">
            <p>Subtotal: ₹{subtotal}</p>
            <p>Delivery: ₹{deliveryFee}</p>
            <p className="text-2xl font-bold text-yellow-400">
              Total: ₹{total}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <Link
            href={`/invoice/${order.id}`}
            className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition"
          >
            Download Invoice
          </Link>

          <Link
            href="/books"
            className="border border-yellow-400 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/orders"
            className="border border-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-700 transition"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}