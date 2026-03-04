"use client";

import Link from "next/link";

export default function Footer() {

  return (

    <footer className="relative bg-black border-t border-gray-800 mt-24 overflow-hidden">

      {/* background glow */}

      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 text-gray-400 relative">

        {/* GRID */}

        <div className="grid md:grid-cols-4 gap-12">

          {/* BRAND */}

          <div>

            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 bg-clip-text text-transparent mb-4">

              📚 Surendra Book Store

            </h2>

            <p className="text-sm leading-relaxed">

              Discover thousands of books across genres.
              Premium reading experience with secure checkout
              and fast delivery across India.

            </p>

            {/* newsletter */}

            <div className="mt-6 flex">

              <input
                placeholder="Your email"
                className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-l-full text-sm outline-none focus:border-yellow-400"
              />

              <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-r-full text-sm font-semibold hover:scale-105 transition">

                Subscribe

              </button>

            </div>

          </div>

          {/* QUICK LINKS */}

          <div>

            <h3 className="text-yellow-400 font-semibold mb-4">

              Quick Links

            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <Link href="/" className="hover:text-yellow-400 transition">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/books" className="hover:text-yellow-400 transition">
                  Books
                </Link>
              </li>

              <li>
                <Link href="/cart" className="hover:text-yellow-400 transition">
                  Cart
                </Link>
              </li>

              <li>
                <Link href="/orders" className="hover:text-yellow-400 transition">
                  Orders
                </Link>
              </li>

            </ul>

          </div>

          {/* SUPPORT */}

          <div>

            <h3 className="text-yellow-400 font-semibold mb-4">

              Support

            </h3>

            <ul className="space-y-2 text-sm">

              <li>
                <Link href="#" className="hover:text-yellow-400 transition">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-yellow-400 transition">
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-yellow-400 transition">
                  Refund Policy
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-yellow-400 transition">
                  Help Center
                </Link>
              </li>

            </ul>

          </div>

          {/* CONTACT */}

          <div>

            <h3 className="text-yellow-400 font-semibold mb-4">

              Contact

            </h3>

            <p className="text-sm mb-2">

              📧
              <a
                href="mailto:amritlal8302381403@gmail.com"
                className="hover:text-yellow-400 transition ml-1"
              >
                amritlal8302381403@gmail.com
              </a>

            </p>

            <p className="text-sm mb-4">

              📞
              <a
                href="tel:+918000411638"
                className="hover:text-yellow-400 transition ml-1"
              >
                +91 8000411638
              </a>

            </p>

            {/* SOCIAL */}

            <div className="flex gap-4 text-xl">

              <span className="hover:text-yellow-400 hover:scale-110 transition cursor-pointer">
                🌐
              </span>

              <span className="hover:text-blue-400 hover:scale-110 transition cursor-pointer">
                📘
              </span>

              <span className="hover:text-pink-400 hover:scale-110 transition cursor-pointer">
                📸
              </span>

              <span className="hover:text-sky-400 hover:scale-110 transition cursor-pointer">
                🐦
              </span>

            </div>

          </div>

        </div>

        {/* BOTTOM */}

        <div className="border-t border-gray-800 mt-16 pt-6 text-center text-sm">

          <p className="text-gray-500">

            © {new Date().getFullYear()} Surendra Book Store.
            All rights reserved.

          </p>

        </div>

      </div>

    </footer>

  );

}