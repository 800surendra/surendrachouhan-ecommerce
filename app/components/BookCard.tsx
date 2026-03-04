"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Book } from "../context/BookContext";
import { motion } from "framer-motion";

export default function BookCard({ book }: { book: Book }) {

  const { addToCart } = useCart();

  const outOfStock = book.stock === 0;

  return (

    <motion.div
      whileHover={{ y: -6 }}
      className={`relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 border border-gray-800 shadow-xl transition overflow-hidden ${
        outOfStock ? "opacity-60" : "hover:border-yellow-400"
      }`}
    >

      {/* OUT OF STOCK */}

      {outOfStock && (

        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 text-white font-bold text-lg">

          Out of Stock

        </div>

      )}

      {/* IMAGE */}

      <Link href={`/books/${book.id}`}>

        <div className="overflow-hidden rounded-xl mb-4">

          <img
            src={book.image}
            alt={book.title}
            className="h-52 w-full object-cover transition duration-500 hover:scale-110"
          />

        </div>

      </Link>

      {/* CATEGORY */}

      <div className="text-xs mb-2 inline-block px-3 py-1 bg-purple-600/20 text-purple-400 rounded-full">

        {book.category}

      </div>

      {/* TITLE */}

      <Link
        href={`/books/${book.id}`}
        className="block text-lg font-semibold mb-1 hover:text-yellow-400 transition"
      >

        {book.title}

      </Link>

      {/* AUTHOR */}

      <p className="text-gray-400 text-sm mb-2">

        by {book.author}

      </p>

      {/* PRICE */}

      <div className="flex items-center justify-between mb-4">

        <p className="text-yellow-400 font-bold text-xl">

          ₹{book.price}

        </p>

        {!outOfStock && (

          <span className="text-green-400 text-xs font-semibold">

            In Stock

          </span>

        )}

      </div>

      {/* ADD TO CART */}

      <button
        onClick={() => addToCart(book)}
        disabled={outOfStock}
        className={`w-full py-2 rounded-full font-semibold transition ${
          outOfStock
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105"
        }`}
      >

        {outOfStock ? "Unavailable" : "Add to Cart"}

      </button>

    </motion.div>

  );

}