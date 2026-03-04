"use client";

import { useCart } from "../../context/CartContext";
import { useBooks } from "../../context/BookContext";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { motion } from "framer-motion";

export default function BookDetailPage() {

  const { books } = useBooks();
  const { addToCart } = useCart();
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const book = useMemo(() => {
    return books.find((b) => b.id === id);
  }, [books, id]);

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

  const outOfStock = book.stock === 0;

  return (

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16">

      {/* PRODUCT SECTION */}

      <div className="grid md:grid-cols-2 gap-16 items-center mb-24">

        {/* IMAGE */}

        <motion.div
          whileHover={{ scale: 1.04 }}
          className="relative"
        >

          <img
            src={book.image}
            alt={book.title}
            className="w-full rounded-3xl shadow-2xl object-cover"
          />

        </motion.div>

        {/* DETAILS */}

        <div>

          <span className="inline-block mb-3 px-4 py-1 text-xs bg-purple-600/20 text-purple-400 rounded-full">

            {book.category}

          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">

            {book.title}

          </h1>

          <p className="text-gray-400 mb-6 text-lg">

            by {book.author}

          </p>

          {/* RATING UI */}

          <div className="flex gap-1 text-yellow-400 mb-6 text-lg">

            ⭐⭐⭐⭐⭐

          </div>

          <p className="text-gray-300 leading-relaxed mb-8">

            {book.description}

          </p>

          {/* PRICE */}

          <p className="text-4xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-8">

            ₹{book.price}

          </p>

          {!outOfStock && (

            <p className="text-green-400 text-sm mb-6">

              ✔ In Stock

            </p>

          )}

          {outOfStock && (

            <p className="text-red-400 text-sm mb-6">

              Out of Stock

            </p>

          )}

          {/* BUTTONS */}

          <div className="flex flex-wrap gap-6">

            <button
              onClick={() => addToCart(book)}
              disabled={outOfStock}
              className={`px-10 py-4 rounded-full font-bold transition ${
                outOfStock
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:scale-105"
              }`}
            >

              {outOfStock ? "Unavailable" : "Add to Cart"}

            </button>

            <button
              onClick={() => {
                addToCart(book);
                router.push("/checkout");
              }}
              disabled={outOfStock}
              className={`px-10 py-4 rounded-full font-bold border border-yellow-400 transition ${
                outOfStock
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-yellow-400 hover:text-black"
              }`}
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

      {/* RELATED BOOKS */}

      {relatedBooks.length > 0 && (

        <section>

          <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">

            Related Books

          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

            {relatedBooks.map((b, index) => (

              <motion.div
                key={b.id}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >

                <Link
                  href={`/books/${b.id}`}
                  className="block bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border border-gray-800 hover:border-yellow-400 transition shadow-xl"
                >

                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-60 object-cover rounded-xl mb-4"
                  />

                  <h3 className="font-semibold text-lg">

                    {b.title}

                  </h3>

                  <p className="text-yellow-400 font-bold mt-2">

                    ₹{b.price}

                  </p>

                </Link>

              </motion.div>

            ))}

          </div>

        </section>

      )}

    </main>

  );

}