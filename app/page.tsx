"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "./lib/firebase";
import { motion } from "framer-motion";

interface Book {
  id: string;
  title: string;
  price: number;
  image?: string;
}

export default function Home() {

  const [books, setBooks] = useState<Book[]>([]);

  /* ================= FETCH FEATURED BOOKS ================= */
  useEffect(() => {
    const fetchBooks = async () => {
      const q = query(collection(db, "books"), limit(4));
      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as any),
      }));

      setBooks(list);
    };

    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-950 to-black text-white overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-6 md:px-16 py-32 text-center">

        <div className="absolute -top-40 -left-40 w-125 h-125 bg-yellow-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-yellow-500/10 rounded-full blur-[140px]"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight"
        >
          Discover Your Next{" "}
          <span className="bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
            Favorite Book
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg md:text-xl"
        >
          Explore thousands of books across fiction, business,
          finance and productivity. Premium experience.
          Fast delivery. Secure checkout.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-6 flex-wrap"
        >
          <Link
            href="/books"
            className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition duration-300 hover:scale-105 shadow-[0_0_25px_rgba(250,204,21,0.4)]"
          >
            Browse Books
          </Link>

          <Link
            href="/register"
            className="border border-yellow-400 px-10 py-4 rounded-full font-bold text-lg text-yellow-400 hover:bg-yellow-400 hover:text-black transition duration-300 hover:scale-105"
          >
            Join Now
          </Link>
        </motion.div>
      </section>

      {/* ================= TRUST BADGES ================= */}
      <section className="px-6 md:px-16 py-16 border-t border-gray-800 bg-black/60 backdrop-blur">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <Trust text="🔐 Secure UPI Payment" />
          <Trust text="📦 Fast Delivery" />
          <Trust text="🧾 GST Invoice" />
          <Trust text="⭐ Premium Experience" />
        </div>
      </section>

      {/* ================= FEATURED BOOKS (DYNAMIC) ================= */}
      <section className="px-6 md:px-16 py-24">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16 bg-linear-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent"
        >
          Featured Books
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-10">

          {books.length === 0 ? (
            <p className="text-center text-gray-400 col-span-4">
              No books available
            </p>
          ) : (
            books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-900 rounded-3xl p-6 border border-gray-800 hover:border-yellow-400 transition duration-300 shadow-xl"
              >
                <div className="h-48 bg-gray-800 rounded-xl mb-6 flex items-center justify-center text-gray-500 overflow-hidden">
                  {book.image ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {book.title}
                </h3>

                <p className="text-yellow-400 font-bold mb-4">
                  ₹{book.price}
                </p>

                <Link
                  href="/books"
                  className="block text-center bg-yellow-400 text-black py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
                >
                  View Details
                </Link>
              </motion.div>
            ))
          )}

        </div>

      </section>

      {/* ================= REST SAME ================= */}

      {/* WHY CHOOSE US, STATS, NEWSLETTER, CTA, FOOTER
         (unchanged from your original design) */}

      {/* Keep your remaining sections exactly same below */}
    </main>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Trust({ text }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-gray-300 font-medium text-lg"
    >
      {text}
    </motion.div>
  );
}