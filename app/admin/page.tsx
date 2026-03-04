"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import emailjs from "@emailjs/browser";
import { generateInvoice } from "../lib/generateInvoice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ================= TYPES ================= */

interface Order {
  id: string;
  userEmail?: string;
  total: number;
  status: string;
  paymentStatus?: string;
  transactionId?: string;
  createdAt: any;
  items: any[];
}

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  image: string;
}

/* ================= MAIN ================= */

export default function AdminPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    description: "",
    image: "",
    stock: "",
  });

  /* ===== Role Protection ===== */
  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/");
    }
  }, [role, loading]);

  /* ===== Orders Listener ===== */
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setOrders(list);
    });
    return () => unsub();
  }, []);

  /* ===== Books Listener ===== */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "books"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));
      setBooks(list);
    });
    return () => unsub();
  }, []);

  if (loading || role !== "admin") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Admin...
      </div>
    );
  }

  /* ================= REVENUE ================= */

  const revenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.total, 0);

  const chartData = orders
    .filter((o) => o.paymentStatus === "Paid")
    .map((o) => ({
      name: o.id.slice(0, 4),
      sales: o.total,
    }));

  /* ================= VERIFY PAYMENT ================= */
const sendOrderEmail = async (order: Order) => {
  const invoice = generateInvoice(order);
  try {
    await emailjs.send(
      "service_u542doz",
      "template_6guvh9s",
      {
        user_name: order.userEmail?.split("@")[0] || "Customer",
        order_id: order.id,
        total: order.total,
        to_email: order.userEmail,
      },
      "Ws2mqRUzF6DMVUFhk"
    );

    console.log("Email sent ✅");
  } catch (error) {
    console.error("Email failed ❌", error);
  }
};
  const verifyPayment = async (order: Order) => {
    try {
      if (order.paymentStatus === "Paid") {
        alert("Already verified");
        return;
      }

      await runTransaction(db, async (transaction) => {
        for (const item of order.items) {
          const bookRef = doc(db, "books", item.id);
          const bookSnap = await transaction.get(bookRef);

          if (!bookSnap.exists()) {
            throw new Error("Book not found");
          }

          const bookData = bookSnap.data();

          if (bookData.stock < item.quantity) {
            throw new Error("Out of stock");
          }

          transaction.update(bookRef, {
            stock: bookData.stock - item.quantity,
          });
        }

        const orderRef = doc(db, "orders", order.id);

        transaction.update(orderRef, {
          paymentStatus: "Paid",
          status: "Processing",
          verifiedAt: new Date(),
        });
      });
await sendOrderEmail(order);
      alert("Payment Verified ✅");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const rejectPayment = async (order: Order) => {
    await updateDoc(doc(db, "orders", order.id), {
      paymentStatus: "Rejected",
      status: "Cancelled",
    });
  };

  const updateDelivery = async (orderId: string, newStatus: string) => {
    await updateDoc(doc(db, "orders", orderId), {
      status: newStatus,
    });
  };

  /* ================= BOOK ADD ================= */
const uploadImage = async (file: File) => {
  try {
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "bookstore_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dmb38ab37/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    setForm((prev) => ({
      ...prev,
      image: json.secure_url,
    }));

  } catch (err) {
    alert("Image upload failed");
  } finally {
    setUploading(false);
  }
};
  const handleAddBook = async () => {
    if (!form.title || !form.price || !form.stock) return;

    await addDoc(collection(db, "books"), {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      createdAt: serverTimestamp(),
    });

    setForm({
      title: "",
      author: "",
      price: "",
      category: "",
      description: "",
      image: "",
      stock: "",
    });
  };

  /* ================= BOOK SAVE ================= */

  const saveBook = async (book: Book) => {
    await updateDoc(doc(db, "books", book.id), {
      ...book,
      price: Number(book.price),
      stock: Number(book.stock),
    });
    setEditingBookId(null);
  };

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-16">

      <h1 className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">
  👑 Surendra Ultra Admin Dashboard
</h1>

      {/* ===== STATS ===== */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <Stat title="Orders" value={orders.length} />
        <Stat title="Books" value={books.length} />
        <Stat title="Revenue" value={`₹${revenue}`} />
        <Stat
          title="Pending Payments"
          value={
            orders.filter((o) => o.paymentStatus === "Verification Pending")
              .length
          }
        />
      </div>

      {/* ===== GRAPH ===== */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-3xl mb-16 shadow-2xl border border-gray-800">
        <h2 className="text-xl text-yellow-400 mb-6">📊 Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Bar dataKey="sales" fill="#facc15" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== ORDERS ===== */}
      <div className="bg-gray-900 p-8 rounded-3xl mb-16 shadow-xl">
        <h2 className="text-2xl text-yellow-400 mb-6">📦 Manage Orders</h2>

        {orders.map((order) => (
          <div key={order.id} className="border-b border-gray-700 pb-6 mb-6">

            <div className="flex justify-between flex-wrap gap-4">

              <div>
                <p className="text-yellow-400">{order.userEmail || "No Email"}</p>
                <p className="text-gray-400">₹{order.total}</p>
              </div>

              <div className="flex gap-3 flex-wrap">

                <span className="px-3 py-1 bg-gray-800 rounded">
                  {order.paymentStatus}
                </span>

                <select
                  value={order.status}
                  onChange={(e) =>
                    updateDelivery(order.id, e.target.value)
                  }
                  className="bg-gray-800 px-3 py-2 rounded"
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>

                {order.paymentStatus === "Verification Pending" && (
                  <>
                    <button
                      onClick={() => verifyPayment(order)}
                      className="bg-green-500 px-4 py-2 rounded"
                    >
                      Verify
                    </button>

                    <button
                      onClick={() => rejectPayment(order)}
                      className="bg-red-500 px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded"
                >
                  View
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== BOOKS ===== */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-800">
        <h2 className="text-2xl text-yellow-400 mb-6">📚 Manage Books</h2>

        {books.map((book) => (
          <div key={book.id} className="border-b border-gray-700 pb-4 mb-4">

            {editingBookId === book.id ? (
  <>
    <input
      value={book.title || ""}
      onChange={(e) =>
        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? { ...b, title: e.target.value }
              : b
          )
        )
      }
      className="bg-gray-800 p-2 rounded w-full mb-2"
      placeholder="Title"
    />

    <input
      value={book.author || ""}
      onChange={(e) =>
        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? { ...b, author: e.target.value }
              : b
          )
        )
      }
      className="bg-gray-800 p-2 rounded w-full mb-2"
      placeholder="Author"
    />

    <input
      type="number"
      value={book.price ?? 0}
      onChange={(e) =>
        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? { ...b, price: Number(e.target.value) }
              : b
          )
        )
      }
      className="bg-gray-800 p-2 rounded w-full mb-2"
      placeholder="Price"
    />

    <input
      type="number"
      value={book.stock ?? 0}
      onChange={(e) =>
        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? { ...b, stock: Number(e.target.value) }
              : b
          )
        )
      }
      className="bg-gray-800 p-2 rounded w-full mb-2"
      placeholder="Stock"
    />

    <input
      value={book.category || ""}
      onChange={(e) =>
        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? { ...b, category: e.target.value }
              : b
          )
        )
      }
      className="bg-gray-800 p-2 rounded w-full mb-2"
      placeholder="Category"
    />

    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      uploadImage(e.target.files[0]);
    }
  }}
  className="bg-gray-800 p-2 rounded w-full mb-2"
/>

{uploading && (
  <p className="text-yellow-400 text-sm">Uploading image...</p>
)}

{form.image && (
  <img
    src={form.image}
    className="w-24 h-24 object-cover rounded mt-2"
  />
)}

    <textarea
      value={book.description || ""}
      onChange={(e) =>
        setBooks((prev) =>
          prev.map((b) =>
            b.id === book.id
              ? { ...b, description: e.target.value }
              : b
          )
        )
      }
      className="bg-gray-800 p-2 rounded w-full mb-2"
      placeholder="Description"
    />

    <button
      onClick={() => saveBook(book)}
      className="bg-green-500 px-4 py-2 rounded mr-2"
    >
      Save
    </button>

    <button
      onClick={() => setEditingBookId(null)}
      className="bg-red-500 px-4 py-2 rounded"
    >
      Cancel
    </button>
  </>
) : (
              <div className="flex justify-between">
                <div>
                  <p>{book.title}</p>
                  <p className="text-gray-400">
                    ₹{book.price} | Stock: {book.stock}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingBookId(book.id)}
                    className="bg-blue-500 px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteDoc(doc(db, "books", book.id))
                    }
                    className="bg-red-500 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* ADD BOOK */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {Object.keys(form).map((field) => (
            <input
              key={field}
              placeholder={field}
              value={(form as any)[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="bg-gray-800 p-3 rounded"
            />
          ))}
        </div>

        <button
          onClick={handleAddBook}
          className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-full"
        >
          Add Book
        </button>
      </div>

      {/* ===== ORDER MODAL ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-3xl w-full max-w-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4"
            >
              ✕
            </button>

            <h2 className="text-2xl text-yellow-400 mb-6">Order Details</h2>

            <p>Email: {selectedOrder.userEmail}</p>
            <p>Total: ₹{selectedOrder.total}</p>
            <p>Transaction: {selectedOrder.transactionId}</p>

            <div className="mt-4 space-y-2">
              {selectedOrder.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.title} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

function Stat({ title, value }: any) {

  return (

    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl text-center shadow-xl border border-gray-800 hover:border-yellow-400 transition">

      <p className="text-gray-400 mb-2">
        {title}
      </p>

      <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
        {value}
      </h2>

    </div>

  );

}