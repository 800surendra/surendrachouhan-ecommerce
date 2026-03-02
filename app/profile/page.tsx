"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white px-6 md:px-16 py-16 flex justify-center items-center">

      <div className="relative bg-gray-900/80 backdrop-blur border border-gray-800 rounded-3xl p-12 shadow-2xl max-w-xl w-full overflow-hidden">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 text-8xl font-bold text-yellow-400 pointer-events-none">
          Surendra
        </div>

        <h1 className="text-4xl font-bold mb-10 text-center text-yellow-400 relative z-10">
          👤 My Profile
        </h1>

        <div className="space-y-8 relative z-10">

          {/* Profile Avatar */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-black text-3xl font-bold shadow-lg">
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user.email?.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Name */}
          <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-sm">Name</p>
            <p className="text-xl font-semibold text-yellow-400">
              {user.displayName || "Not Provided"}
            </p>
          </div>

          {/* Email */}
          <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-xl font-semibold">
              {user.email}
            </p>
          </div>

          {/* UID */}
          <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-sm">User ID</p>
            <p className="text-sm break-all text-gray-300">
              {user.uid}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-8">

            <button
              onClick={() => router.push("/orders")}
              className="w-full border border-yellow-400 py-3 rounded-full font-bold hover:bg-yellow-400 hover:text-black transition"
            >
              View My Orders
            </button>

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-300 transition shadow-lg"
            >
              Logout
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}