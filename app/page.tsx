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

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">

      {/* HERO */}

      <section className="relative px-6 md:px-20 py-36 text-center">

        <div className="absolute -top-60 left-0 w-[500px] h-[500px] bg-purple-500/20 blur-[160px] rounded-full"></div>
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-yellow-500/20 blur-[160px] rounded-full"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl font-extrabold leading-tight mb-8"
        >

          Discover Your Next

          <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">

            Favorite Book

          </span>

        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg mb-12"
        >

          Explore bestselling fiction, business and productivity books.
          Premium reading experience with secure checkout.

        </motion.p>

        <div className="flex justify-center gap-6 flex-wrap">

          <Link
            href="/books"
            className="bg-yellow-400 text-black px-10 py-4 rounded-full font-bold hover:bg-yellow-300 transition hover:scale-105 shadow-lg"
          >
            Browse Books
          </Link>

          <Link
            href="/register"
            className="border border-purple-400 text-purple-400 px-10 py-4 rounded-full font-bold hover:bg-purple-500 hover:text-white transition"
          >
            Join Community
          </Link>

        </div>

      </section>

      {/* TRUST */}

      <section className="px-6 md:px-20 py-20 border-t border-gray-800">

        <div className="grid md:grid-cols-4 gap-8 text-center">

          <Trust text="🔐 Secure Payments" />
          <Trust text="🚚 Fast Delivery" />
          <Trust text="📚 Premium Books" />
          <Trust text="⭐ Trusted Store" />

        </div>

      </section>

      {/* FEATURED BOOKS */}

      <section className="px-6 md:px-20 py-28">

        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-400 to-purple-500 bg-clip-text text-transparent">

          Featured Books

        </h2>

        <div className="grid md:grid-cols-4 gap-10">

          {books.length === 0 ? (

            <p className="text-gray-400 text-center col-span-4">
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
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl border border-gray-800 hover:border-yellow-400 transition shadow-xl"
              >

                <div className="h-48 rounded-xl mb-6 overflow-hidden">

                  {book.image ? (

                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="h-full flex items-center justify-center text-gray-500 bg-gray-800">
                      No Image
                    </div>

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
                  className="block text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-black py-2 rounded-full font-semibold hover:scale-105 transition"
                >
                  View Details
                </Link>

              </motion.div>

            ))

          )}

        </div>

      </section>

      {/* STATS */}

      <section className="px-6 md:px-20 py-24 bg-black border-t border-gray-800">

        <div className="grid md:grid-cols-3 gap-12 text-center">

          <Stat number="10K+" label="Happy Readers" />
          <Stat number="500+" label="Books Available" />
          <Stat number="24/7" label="Customer Support" />

        </div>

      </section>

      {/* NEWSLETTER */}

      <section className="px-6 md:px-20 py-28 text-center">

        <h2 className="text-4xl font-bold mb-6">
          Join Our Newsletter
        </h2>

        <p className="text-gray-400 mb-10">

          Get updates on new books and exclusive deals.

        </p>

        <div className="flex justify-center gap-4 flex-wrap">

          <input
            placeholder="Enter your email"
            className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-full w-64"
          />

          <button className="bg-purple-500 px-6 py-3 rounded-full font-semibold hover:bg-purple-400 transition">
            Subscribe
          </button>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="px-6 md:px-20 py-32 text-center bg-gradient-to-r from-purple-900/20 to-yellow-900/20">

        <h2 className="text-5xl font-bold mb-6">

          Start Your Reading Journey Today

        </h2>

        <Link
          href="/books"
          className="bg-yellow-400 text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition"
        >
          Explore Books
        </Link>

      </section>

    </main>

  );

}

/* SMALL COMPONENTS */

function Trust({ text }: any) {

  return (

    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="text-gray-300 text-lg font-medium"
    >

      {text}

    </motion.div>

  );

}

function Stat({ number, label }: any) {

  return (

    <div>

      <h3 className="text-5xl font-bold text-yellow-400 mb-2">

        {number}

      </h3>

      <p className="text-gray-400">

        {label}

      </p>

    </div>

  );

}