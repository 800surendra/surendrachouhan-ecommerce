"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-24">
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 text-gray-400">

        {/* Top Grid */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              📚 Sannar Book Store
            </h2>
            <p className="text-sm leading-relaxed">
              Discover thousands of books across genres.
              Premium experience. Fast delivery. Built for readers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-yellow-400 transition">Home</Link></li>
              <li><Link href="/books" className="hover:text-yellow-400 transition">Books</Link></li>
              <li><Link href="/cart" className="hover:text-yellow-400 transition">Cart</Link></li>
              <li><Link href="/orders" className="hover:text-yellow-400 transition">Orders</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-yellow-400 transition">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition">Refund Policy</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 transition">Help Center</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-4">
              Contact
            </h3>
            <p className="text-sm mb-2">
  📧 
  <a 
    href="mailto:amritlal8302381403@gmail.com"
    className="hover:text-yellow-400 transition"
  >
    amritlal8302381403@gmail.com
  </a>
</p>

<p className="text-sm mb-4">
  📞 
  <a 
    href="tel:+918000411638"
    className="hover:text-yellow-400 transition"
  >
    +91 8000411638
  </a>
</p>

            {/* Social Icons */}
            <div className="flex gap-4 text-lg">
              <span className="hover:text-yellow-400 transition cursor-pointer">🌐</span>
              <span className="hover:text-yellow-400 transition cursor-pointer">📘</span>
              <span className="hover:text-yellow-400 transition cursor-pointer">📸</span>
              <span className="hover:text-yellow-400 transition cursor-pointer">🐦</span>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-sm">
          © {new Date().getFullYear()} Sannar Book Store. All rights reserved.
        </div>

      </div>
    </footer>
  );
}