"use client";

import { useState, useMemo } from "react";
import BookCard from "../components/BookCard";
import { useBooks } from "../context/BookContext";
import { motion } from "framer-motion";

export default function BooksPage() {

  const { books } = useBooks();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  /* ===== Categories ===== */

  const categories = [
    "All",
    ...new Set(books.map((b) => b.category).filter(Boolean)),
  ];

  /* ===== Filter + Search + Sort ===== */

  const filteredBooks = useMemo(() => {

    let result = [...books];

    if (search) {

      result = result.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );

    }

    if (category !== "All") {

      result = result.filter((book) => book.category === category);

    }

    if (sort === "low-high") {

      result.sort((a, b) => a.price - b.price);

    } else if (sort === "high-low") {

      result.sort((a, b) => b.price - a.price);

    }

    result.sort((a, b) => (a.stock === 0 ? 1 : -1));

    return result;

  }, [books, search, category, sort]);

  const clearFilters = () => {

    setSearch("");
    setCategory("All");
    setSort("default");

  };

  return (

    <main className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black text-white px-6 md:px-16 py-16 overflow-hidden">

      {/* HERO HEADER */}

      <section className="text-center mb-14">

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 bg-clip-text text-transparent">

          Explore Our Book Collection

        </h1>

        <p className="text-gray-400">

          Discover your next favorite book

        </p>

        <div className="mt-4 inline-block bg-gray-900 px-4 py-1 rounded-full border border-gray-800 text-yellow-400 text-sm">

          {filteredBooks.length} Books Available

        </div>

      </section>

      {/* FILTER PANEL */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-lg p-6 rounded-3xl border border-gray-800 grid md:grid-cols-4 gap-6 mb-14 shadow-lg"
      >

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* CATEGORY */}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 transition"
        >

          {categories.map((cat, index) => (

            <option key={index}>{cat}</option>

          ))}

        </select>

        {/* SORT */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-orange-400 transition"
        >

          <option value="default">Sort By</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>

        </select>

        {/* CLEAR FILTER */}

        <button
          onClick={clearFilters}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold rounded-lg px-4 py-2 hover:scale-105 transition"
        >

          Clear Filters

        </button>

      </motion.div>

      {/* CATEGORY CHIPS */}

      <div className="flex flex-wrap gap-3 mb-10">

        {categories.map((cat, index) => (

          <button
            key={index}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 rounded-full text-sm border transition ${
              category === cat
                ? "bg-yellow-400 text-black border-yellow-400"
                : "border-gray-700 text-gray-400 hover:border-yellow-400 hover:text-yellow-400"
            }`}
          >

            {cat}

          </button>

        ))}

      </div>

      {/* BOOK GRID */}

      {filteredBooks.length === 0 ? (

        <div className="text-center mt-20">

          <p className="text-gray-400 text-lg">

            No books found matching your criteria

          </p>

        </div>

      ) : (

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {filteredBooks.map((book) => (

            <motion.div
              key={book.id}
              whileHover={{ scale: 1.05 }}
              className={`transition ${
                book.stock === 0
                  ? "opacity-60"
                  : ""
              }`}
            >

              <BookCard book={book} />

            </motion.div>

          ))}

        </div>

      )}

    </main>

  );

}