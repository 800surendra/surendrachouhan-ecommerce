"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TrackOrderPage() {

  const params = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {

      const ref = doc(db, "orders", params.id as string);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setOrder({ id: snap.id, ...snap.data() });
      }

      setLoading(false);
    };

    loadOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Order not found
      </div>
    );
  }

  const steps = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered"
  ];

  const currentIndex = steps.indexOf(order.status);

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
      >
        📦 Track Your Order
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl mx-auto bg-white/5 backdrop-blur border border-gray-800 p-12 rounded-3xl shadow-2xl"
      >

        <p className="text-gray-400 text-sm">
          Order ID
        </p>

        <p className="text-yellow-400 text-2xl font-bold mb-6">
          {order.id}
        </p>

        <p className="text-gray-400 mb-10">
          Estimated Delivery:
          <span className="text-yellow-400 ml-2">
            {estimatedDelivery.toDateString()}
          </span>
        </p>

        {/* Progress Line */}
        <div className="relative">

          <div className="absolute left-3 top-0 w-1 h-full bg-gray-800 rounded" />

          <div
            className="absolute left-3 top-0 w-1 bg-yellow-400 rounded transition-all duration-700"
            style={{
              height: `${(currentIndex / (steps.length - 1)) * 100}%`
            }}
          />

          <div className="space-y-10">

            {steps.map((step, index) => {

              const completed = index < currentIndex;
              const active = index === currentIndex;

              return (
                <div key={step} className="flex items-center gap-6">

                  {/* Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2
                    ${
                      completed
                        ? "bg-green-500 border-green-500"
                        : active
                        ? "bg-yellow-400 border-yellow-400 animate-pulse"
                        : "bg-gray-900 border-gray-700"
                    }`}
                  />

                  {/* Text */}
                  <p
                    className={`text-lg font-semibold
                    ${
                      completed
                        ? "text-green-400"
                        : active
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>

                </div>
              );
            })}

          </div>

        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-14">

          <Link
            href="/orders"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition"
          >
            View All Orders
          </Link>

          <Link
            href="/books"
            className="border border-yellow-400 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition"
          >
            Continue Shopping
          </Link>

        </div>

      </motion.div>

    </main>
  );
}