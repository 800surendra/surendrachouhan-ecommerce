"use client";

import { useCart } from "../../context/CartContext";
import { useBooks } from "../../context/BookContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

export default function BookDetailPage() {
  const { books } = useBooks();
  const { addToCart } = useCart();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  /* ===== Get Current Book ===== */
  const book = useMemo(() => {
    return books.find((b) => b.id === id);
  }, [books, id]);

  /* ===== Related Books ===== */
  const relatedBooks = useMemo(() => {
    if (!book) return [];
    return books
      .filter((b) => b.category === book.category && b.id !== book.id)
      .slice(0, 3);
  }, [books, book]);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Book Not Found
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white px-6 md:px-16 py-16">

      {/* ================= BOOK DETAIL ================= */}
      <div className="grid md:grid-cols-2 gap-14 items-center mb-20">

        {/* Image */}
        <div className="group">
          <img
            src={book.image}
            alt={book.title}
            className="w-full rounded-3xl shadow-2xl group-hover:scale-105 transition duration-500"
          />
        </div>

        {/* Details */}
        <div>
          <p className="text-yellow-400 mb-2 uppercase tracking-wider text-sm">
            {book.category}
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {book.title}
          </h1>

          <p className="text-gray-400 mb-6 text-lg">
            by {book.author}
          </p>

          <p className="text-gray-300 mb-8 leading-relaxed">
            {book.description}
          </p>

          <p className="text-4xl font-bold text-yellow-400 mb-10">
            ₹{book.price}
          </p>

          <div className="flex flex-wrap gap-6">
            <button
              onClick={() => addToCart(book)}
              className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(book);
                router.push("/checkout");
              }}
              className="border border-yellow-400 px-10 py-4 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-10">
            <Link
              href="/books"
              className="text-gray-400 hover:text-yellow-400 transition"
            >
              ← Back to Books
            </Link>
          </div>
        </div>

      </div>

      {/* ================= RELATED BOOKS ================= */}
      {relatedBooks.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-10 text-yellow-400">
            Related Books
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
            {relatedBooks.map((b) => (
              <Link
                key={b.id}
                href={`/books/${b.id}`}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition hover:scale-105"
              >
                <img
                  src={b.image}
                  alt={b.title}
                  className="w-full h-60 object-cover rounded-xl mb-4"
                />
                <h3 className="font-semibold">{b.title}</h3>
                <p className="text-yellow-400 mt-2">₹{b.price}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}