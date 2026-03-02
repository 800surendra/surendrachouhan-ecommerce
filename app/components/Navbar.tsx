"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Navbar() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);

  const totalItems = getTotalItems();

  /* ================= ADMIN ROLE CHECK ================= */

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    };

    checkRole();
  }, [user]);

  /* ================= NAV LINK STYLE ================= */

  const navLink = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`relative px-2 py-1 transition duration-300 font-medium ${
          active
            ? "text-yellow-400"
            : "text-gray-300 hover:text-yellow-400"
        }`}
      >
        {label}

        {/* Animated Underline */}
        <span
          className={`absolute left-0 -bottom-1 h-0.5 bg-yellow-400 rounded-full transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-black/60 border-b border-gray-800 shadow-lg shadow-black/40">
      <div className="flex justify-between items-center px-8 md:px-16 py-4 text-white">

        {/* ===== PREMIUM BRAND LOGO ===== */}
<Link
  href="/"
  className="group flex flex-col leading-tight select-none"
>
  <span className="text-2xl md:text-3xl font-extrabold tracking-wide bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(250,204,21,0.6)] transition duration-300 group-hover:scale-105">
    Surendra
  </span>

  <span className="text-xs text-gray-400 tracking-[0.25em] uppercase transition duration-300 group-hover:text-yellow-400">
    Book Store
  </span>

  {/* Animated underline */}
  <span className="h-0.5 w-0 bg-yellow-400 transition-all duration-500 group-hover:w-full mt-1 rounded-full"></span>
</Link>

        {/* Menu */}
        <div className="flex items-center gap-8 text-sm md:text-base">

          {navLink("/", "Home")}
          {navLink("/books", "Books")}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative text-gray-300 hover:text-yellow-400 transition"
          >
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">
                {totalItems}
              </span>
            )}
          </Link>

          {!user ? (
            navLink("/login", "Login")
          ) : (
            <div className="flex items-center gap-6">

              {navLink("/orders", "Orders")}

              {/* Admin Link */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className={`flex items-center gap-1 font-semibold ${
                    pathname === "/admin"
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  👑 Admin
                </Link>
              )}

              {/* Profile Badge */}
              <Link
                href="/profile"
                className="bg-gray-800 px-4 py-1 rounded-full text-yellow-400 text-sm hover:bg-gray-700 transition"
              >
                👋 {user.email?.split("@")[0]}
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold hover:bg-yellow-300 transition"
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </nav>
  );
}