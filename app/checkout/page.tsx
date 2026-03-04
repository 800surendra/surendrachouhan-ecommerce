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
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
        >
          Browse Books
        </Link>

      </div>
    );

  }

  const placeOrder = async () => {

    const cleanTxnId = txnId.trim().toUpperCase();

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
        throw new Error("Transaction ID already used.");
      }

      const orderRef = doc(collection(db, "orders"));
      const orderId = orderRef.id;

      await runTransaction(db, async (transaction) => {

        transaction.set(orderRef, {

          userId: user.uid,
          userEmail: user.email || "",

          items: cart.map(item => ({
            id: item.id,
            title: item.title,
            price: Number(item.price),
            quantity: Number(item.quantity)
          })),

          subtotal: Number(subtotal),
          deliveryFee: Number(deliveryFee),
          total: Number(total),

          transactionId: cleanTxnId,
          paymentMethod: "UPI",
          paymentStatus: "Verification Pending",
          status: "Pending",

          createdAt: serverTimestamp(),

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

      setError(err.message || "Order failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      <h1 className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">

        Secure Checkout

      </h1>

      <div className="grid lg:grid-cols-2 gap-16">

        {/* DELIVERY + PAYMENT */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 p-10 rounded-3xl shadow-xl"
        >

          <h2 className="text-2xl font-bold mb-6 text-yellow-400">

            Delivery Details

          </h2>

          <div className="space-y-4 mb-10">

            <input
              placeholder="Full Name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-400 outline-none"
            />

            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
              className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-400 outline-none"
            />

            <textarea
              placeholder="Full Address"
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
              className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-400 outline-none"
            />

            <div className="flex gap-4">

              <input
                placeholder="City"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
                className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-400 outline-none"
              />

              <input
                placeholder="Pincode"
                value={pincode}
                onChange={(e)=>setPincode(e.target.value)}
                className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-400 outline-none"
              />

            </div>

          </div>

          <h2 className="text-2xl font-bold mb-6 text-yellow-400">

            Scan & Pay

          </h2>

          {qrImage && (

            <img
              src={qrImage}
              className="mx-auto w-56 rounded-2xl border border-gray-700 mb-6"
            />

          )}

          <p className="text-3xl font-bold text-yellow-400 text-center mb-6">

            ₹{total}

          </p>

          <input
            type="text"
            placeholder="Enter UPI Transaction ID"
            value={txnId}
            onChange={(e)=>setTxnId(e.target.value)}
            className="w-full p-4 rounded-xl bg-black border border-gray-700 focus:border-yellow-400 outline-none"
          />

          {error && (

            <p className="text-red-400 mt-4 text-sm">
              {error}
            </p>

          )}

        </motion.div>

        {/* ORDER SUMMARY */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 p-10 rounded-3xl shadow-xl h-fit"
        >

          <h2 className="text-2xl font-bold mb-8 text-yellow-400">

            Order Summary

          </h2>

          {cart.map((item)=>(
            <div key={item.id} className="flex justify-between mb-4">

              <span>{item.title} × {item.quantity}</span>

              <span>₹{item.price * item.quantity}</span>

            </div>
          ))}

          <div className="border-t border-gray-700 pt-6 mt-6">

            <div className="flex justify-between mb-3">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Delivery</span>
              <span>₹{deliveryFee}</span>
            </div>

            <div className="flex justify-between text-xl font-bold text-yellow-400 mt-4">

              <span>Total</span>

              <span>₹{total}</span>

            </div>

          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-10 bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-4 rounded-full font-bold hover:scale-105 transition"
          >

            {loading ? "Processing..." : "Confirm Payment"}

          </button>

        </motion.div>

      </div>

    </main>

  );

}