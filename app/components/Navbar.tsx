"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Search } from "lucide-react";

export default function Navbar() {

  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");

  const totalItems = getTotalItems();

  /* ===== ADMIN ROLE CHECK ===== */

  useEffect(() => {

    const checkRole = async () => {

      if (!user) {
        setIsAdmin(false);
        return;
      }

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {

  const data = snap.data();

  if (data.role === "admin") {
    setIsAdmin(true);
  } else {
    setIsAdmin(false);
  }

  // ⭐ NAME SET
  setName(data.name);

}

    };

    checkRole();

  }, [user]);

  /* ===== NAV LINK ===== */

  const navLink = (href: string, label: string) => {

    const active = pathname === href;

    return (

      <Link
        href={href}
        className={`relative group font-medium transition ${
          active
            ? "text-yellow-400"
            : "text-gray-300 hover:text-yellow-400"
        }`}
      >

        {label}

        <span
          className={`absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-yellow-400 to-purple-500 rounded-full transition-all duration-300 ${
            active ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />

      </Link>

    );

  };

  return (

    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/70 border-b border-gray-800 shadow-lg">

      <div className="flex items-center justify-between px-6 md:px-16 py-4">

        {/* ===== LOGO ===== */}

        <Link
          href="/"
          className="flex flex-col group leading-tight select-none"
        >

          <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-105 transition">

            Surendra

          </span>

          <span className="text-xs tracking-[0.3em] text-gray-400 group-hover:text-yellow-400 transition">

            BOOK STORE

          </span>

        </Link>

        {/* ===== SEARCH BAR ===== */}

        <div className="hidden md:flex items-center bg-gray-900 border border-gray-800 rounded-full px-4 py-2 w-[350px]">

          <Search size={18} className="text-gray-400 mr-2" />

          <input
            placeholder="Search books..."
            className="bg-transparent outline-none text-sm w-full"
          />

        </div>

        {/* ===== MENU ===== */}

        <div className="flex items-center gap-6 text-sm md:text-base">

          {navLink("/", "Home")}
          {navLink("/books", "Books")}

          {/* ===== CART ===== */}

          <Link
            href="/cart"
            className="relative text-gray-300 hover:text-yellow-400 transition"
          >

            Cart

            {totalItems > 0 && (

              <span className="absolute -top-2 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow animate-bounce">

                {totalItems}

              </span>

            )}

          </Link>

          {!user ? (

            navLink("/login", "Login")

          ) : (

            <div className="flex items-center gap-4">

              {navLink("/orders", "Orders")}

              {/* ADMIN */}

              {isAdmin && (

                <Link
                  href="/admin"
                  className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500 hover:bg-purple-600 hover:text-white transition text-sm"
                >

                  👑 Admin

                </Link>

              )}

              {/* PROFILE */}

              <Link
                href="/profile"
                className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-700 hover:border-yellow-400 transition"
              >

                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 to-purple-500 flex items-center justify-center text-black font-bold text-xs">

                 {name?.charAt(0).toUpperCase()}

                </div>

                <span className="text-yellow-400 text-sm">

                  {name}

                </span>

              </Link>

              {/* LOGOUT */}

              <button
                onClick={logout}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-semibold hover:scale-105 transition"
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