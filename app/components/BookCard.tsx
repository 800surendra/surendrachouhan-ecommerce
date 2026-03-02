"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { Book } from "../context/BookContext";

export default function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-lg hover:scale-105 hover:shadow-yellow-400/30 transition duration-300">

      <Link href={`/books/${book.id}`}>
        <img
          src={book.image}
          alt={book.title}
          className="h-48 w-full object-cover rounded-lg mb-4 cursor-pointer"
        />
      </Link>

      <Link
        href={`/books/${book.id}`}
        className="text-xl font-semibold mb-2 block hover:text-yellow-400 transition"
      >
        {book.title}
      </Link>

      <p className="text-gray-400 text-sm mb-1">
        by {book.author}
      </p>

      <p className="text-gray-400 text-sm mb-2">
        {book.category}
      </p>

      <p className="text-yellow-400 font-bold text-lg mb-4">
        ₹{book.price}
      </p>

      <button
        onClick={() => addToCart(book)}
        className="w-full bg-yellow-400 text-black py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Add to Cart
      </button>

    </div>
  );
}