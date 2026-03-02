"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const router = useRouter();

  // 🔐 Protect page (login required)
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
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center tracking-wide">
        🛒 Your Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-6">
            Your cart is empty.
          </p>

          <Link
            href="/books"
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between items-center bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800 hover:border-yellow-400 transition"
              >
                {/* Left Section */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {item.title}
                  </h2>

                  <p className="text-gray-400 text-sm mt-1">
                    ₹{item.price} per book
                  </p>

                  <p className="text-yellow-400 font-bold mt-2 text-lg">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      −
                    </button>

                    <span className="font-semibold text-lg">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Right Section */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-6 md:mt-0 bg-red-500 px-6 py-2 rounded-lg hover:bg-red-600 transition font-semibold shadow-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total Section */}
          <div className="mt-14 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Total Amount
              </h2>
              <p className="text-gray-400 text-sm">
                Including all items in cart
              </p>
            </div>

            <div className="text-3xl font-bold text-yellow-400">
              ₹{total}
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-10 text-right">
            <Link
              href="/checkout"
              className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg"
            >
              Proceed to Checkout →
            </Link>
          </div>
        </>
      )}
    </main>
  );
}