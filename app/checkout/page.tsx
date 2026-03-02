"use client";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  serverTimestamp,
  doc,
  runTransaction,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txnId, setTxnId] = useState("");
  const [qrImage, setQrImage] = useState("");

  /* 🔥 NEW DELIVERY STATES */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 49 : 0;
  const total = subtotal + deliveryFee;

  const upiId = "8000411638@KOTAK811";

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const generateQR = async () => {
      const upiLink = `upi://pay?pa=${upiId}&pn=Surendra%20Book%20Store&am=${total}&cu=INR`;
      const qr = await QRCode.toDataURL(upiLink);
      setQrImage(qr);
    };

    if (total > 0) generateQR();
  }, [user, total, router]);

  if (!user) return null;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-400">
          Your Cart is Empty
        </h1>
        <Link
          href="/books"
          className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  const placeOrder = async () => {
    const cleanTxnId = txnId.trim().toUpperCase();

    /* 🔥 DELIVERY VALIDATION */
    if (!name || !phone || !address || !city || !pincode) {
      setError("Please fill all delivery details");
      return;
    }

    if (!cleanTxnId) {
      setError("Please enter UPI Transaction ID");
      return;
    }

    if (cleanTxnId.length < 6) {
      setError("Invalid Transaction ID");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const txnQuery = query(
        collection(db, "orders"),
        where("transactionId", "==", cleanTxnId)
      );

      const txnSnap = await getDocs(txnQuery);
      if (!txnSnap.empty) {
        throw new Error("This Transaction ID is already used.");
      }

      const orderRef = doc(collection(db, "orders"));
      const orderId = orderRef.id;

      await runTransaction(db, async (transaction) => {
        transaction.set(orderRef, {
          userId: user.uid,
          userEmail: user.email || "",
          items: cart,
          subtotal,
          deliveryFee,
          total,
          transactionId: cleanTxnId,
          paymentMethod: "UPI",
          paymentStatus: "Verification Pending",
          status: "Pending",
          createdAt: serverTimestamp(),

          /* 🔥 SAVE CUSTOMER DETAILS */
          customerDetails: {
            name,
            phone,
            address,
            city,
            pincode,
          },
        });
      });

      clearCart();
      router.push(`/success/${orderId}`);

    } catch (err: any) {
      setError(err.message || "Order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      <h1 className="text-5xl font-extrabold text-center mb-16 bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        💳 Secure Checkout
      </h1>

      <div className="grid md:grid-cols-2 gap-14">

        {/* LEFT - DELIVERY + PAYMENT */}
        <div className="bg-white/5 backdrop-blur border border-gray-800 p-10 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">
            Delivery Details
          </h2>

          <div className="space-y-4 mb-8">
            <input placeholder="Full Name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700" />

            <input placeholder="Phone Number" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700" />

            <textarea placeholder="Full Address" value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700" />

            <div className="flex gap-4">
              <input placeholder="City" value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700" />

              <input placeholder="Pincode" value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700" />
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-yellow-400">
            Scan & Pay
          </h2>

          {qrImage && (
            <img src={qrImage}
              className="mx-auto w-56 rounded-2xl border border-gray-700 mb-6" />
          )}

          <p className="text-xl font-bold text-yellow-400 mb-6">₹{total}</p>

          <input
            type="text"
            placeholder="Enter UPI Transaction ID"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700"
          />

          {error && (
            <p className="text-red-400 text-sm mt-4">{error}</p>
          )}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="bg-white/5 backdrop-blur border border-gray-800 p-10 rounded-3xl shadow-2xl">

          <h2 className="text-2xl font-semibold mb-8 text-yellow-400">
            Order Summary
          </h2>

          {cart.map((item) => (
            <div key={item.id} className="flex justify-between mb-3">
              <span>{item.title} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="border-t border-gray-700 pt-6 mt-6">
            <div className="flex justify-between">
              <span>Total</span>
              <span className="text-yellow-400 font-bold text-xl">₹{total}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-10 bg-linear-to-r from-yellow-400 to-orange-500 text-black py-4 rounded-full font-bold hover:scale-105 transition"
          >
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
        </div>

      </div>
    </main>
  );
}