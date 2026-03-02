"use client";

import { useState, useMemo } from "react";
import BookCard from "../components/BookCard";
import { useBooks } from "../context/BookContext";

export default function BooksPage() {
  const { books } = useBooks();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

  /* ===== Unique Categories ===== */
  const categories = [
    "All",
    ...new Set(books.map((b) => b.category).filter(Boolean)),
  ];

  /* ===== Filter + Search + Sort + Stock Priority ===== */
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search
    if (search) {
      result = result.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category
    if (category !== "All") {
      result = result.filter((book) => book.category === category);
    }

    // Sort price
    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    // Push Out of Stock books to bottom
    result.sort((a, b) => (a.stock === 0 ? 1 : -1));

    return result;
  }, [books, search, category, sort]);

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white px-6 md:px-16 py-16">

      {/* ===== Header ===== */}
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-400">
        📚 Explore Our Collection
      </h1>

      <p className="text-center text-gray-400 mb-12">
        {filteredBooks.length} books available
      </p>

      {/* ===== Filters Section ===== */}
      <div className="bg-gray-900 p-6 rounded-2xl mb-12 border border-gray-800 grid md:grid-cols-3 gap-6 shadow-lg">

        {/* Search */}
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition"
        >
          {categories.map((cat, index) => (
            <option key={index}>{cat}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-800 p-3 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400 transition"
        >
          <option value="default">Sort By</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

      </div>

      {/* ===== Books Grid ===== */}
      {filteredBooks.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-400 text-lg">
            No books found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className={`transition duration-300 ${
                book.stock === 0
                  ? "opacity-60"
                  : "hover:scale-105"
              }`}
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}