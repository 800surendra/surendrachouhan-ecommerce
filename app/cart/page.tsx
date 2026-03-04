"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { motion } from "framer-motion";

export default function CartPage() {

  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, [router]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      <h1 className="text-4xl font-extrabold mb-14 text-center bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">

        🛒 Your Shopping Cart

      </h1>

      {cart.length === 0 ? (

        <div className="text-center mt-20">

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            <p className="text-gray-400 text-lg mb-8">
              Your cart is empty
            </p>

            <Link
              href="/books"
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition"
            >
              Browse Books
            </Link>

          </motion.div>

        </div>

      ) : (

        <div className="grid lg:grid-cols-3 gap-12">

          {/* CART ITEMS */}

          <div className="lg:col-span-2 space-y-6">

            {cart.map((item, index) => (

              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border border-gray-800 hover:border-yellow-400 transition shadow-xl"
              >

                {/* IMAGE */}

                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-36 object-cover rounded-xl"
                />

                {/* INFO */}

                <div className="flex-1">

                  <h2 className="text-lg font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    ₹{item.price} per book
                  </p>

                  <p className="text-yellow-400 font-bold text-lg mt-2">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* QUANTITY */}

                  <div className="flex items-center gap-4 mt-4">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
                    >
                      −
                    </button>

                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600 transition"
                    >
                      +
                    </button>

                  </div>

                </div>

                {/* REMOVE BUTTON */}

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 px-6 py-2 rounded-full hover:bg-red-600 transition font-semibold"
                >

                  Remove

                </button>

              </motion.div>

            ))}

          </div>

          {/* SUMMARY */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl border border-gray-800 h-fit sticky top-24 shadow-xl"
          >

            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="flex justify-between mb-4 text-gray-400">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between mb-6 text-gray-400">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>

            <div className="border-t border-gray-800 pt-6 flex justify-between text-xl font-bold text-yellow-400">

              <span>Total</span>
              <span>₹{total}</span>

            </div>

            <Link
              href="/checkout"
              className="block mt-8 w-full text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-3 rounded-full font-bold hover:scale-105 transition"
            >

              Proceed to Checkout →

            </Link>

          </motion.div>

        </div>

      )}

    </main>

  );

}