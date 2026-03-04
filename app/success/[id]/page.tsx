"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function SuccessPage() {

  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user) return;

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

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-3xl p-12 shadow-2xl"
      >

        {/* SUCCESS HEADER */}

        <div className="text-center mb-14">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-7xl mb-6 text-green-400"
          >

            ✅

          </motion.div>

          <h1 className="text-4xl font-extrabold mb-2">

            Payment Submitted Successfully

          </h1>

          <p className="text-gray-400">

            Your payment is under verification by our team.

          </p>

          <div className="mt-4 inline-block bg-yellow-400/10 text-yellow-400 px-4 py-1 rounded-full text-sm">

            Status: Verification Pending

          </div>

        </div>

        {/* ORDER CARD */}

        <div className="bg-black/40 border border-gray-800 p-8 rounded-2xl">

          <p className="text-gray-400 text-sm">

            Order ID

          </p>

          <p className="text-yellow-400 text-xl font-bold mb-8">

            {order.id}

          </p>

          {/* ITEMS */}

          <div className="space-y-4">

            {items.map((item: any) => (

              <div
                key={item.id}
                className="flex justify-between border-b border-gray-800 pb-3"
              >

                <span>

                  {item.title} × {item.quantity}

                </span>

                <span>

                  ₹{item.price * item.quantity}

                </span>

              </div>

            ))}

          </div>

          {/* TOTAL */}

          <div className="border-t border-gray-700 mt-8 pt-6 text-right space-y-2">

            <p>

              Subtotal: ₹{subtotal}

            </p>

            <p>

              Delivery: ₹{deliveryFee}

            </p>

            <p className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">

              Total: ₹{total}

            </p>

          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex flex-wrap justify-center gap-6 mt-12">

          <Link
            href={`/invoice/${order.id}`}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition"
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
<Link
  href="/orders"
  className="border border-gray-600 px-8 py-3 rounded-full font-bold hover:bg-gray-700 transition"
>
  View Orders
</Link>
          </Link>
<Link
  href={`/track/${order.id}`}
  className="border border-yellow-400 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition"
>
  Track Order
</Link>
        </div>

      </motion.div>

    </main>

  );

}