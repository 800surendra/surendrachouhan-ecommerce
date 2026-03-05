"use client";

import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterPage() {

  const { register, user } = useAuth();
  const router = useRouter();

  // ⭐ NEW
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ⭐ OPTIONAL (future use)
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔒 If already logged in redirect to home
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleRegister = async () => {

    if (!name || !email || !password) {
      return setError("Please fill all fields");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      // 🔐 Create user
      const userCredential = await register(email, password);
      const userData = userCredential.user;

      // ⭐ SAVE USER DATA (Firestore)
      await setDoc(doc(db, "users", userData.uid), {
        name: name,
        email: email,
        phone: phone || "",
        role: "user",
        createdAt: new Date()
      });

      // 📧 Send OTP
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userData.email,
          uid: userData.uid,
        }),
      });

      // 🔑 Save UID locally
      localStorage.setItem("verify_uid", userData.uid);

      // 🔐 IMPORTANT → logout user after register
      // await signOut(auth);

      setSuccess("OTP sent to your email. Verify to continue.");

      setTimeout(() => {
        router.push("/verify");
      }, 1500);

    } catch (err: any) {

      setError(err.message.replace("Firebase:", ""));

    } finally {

      setLoading(false);

    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-6">

      <div className="bg-gray-900/80 backdrop-blur p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-3xl font-bold mb-2 text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Join Surendra Book Store 📚
        </p>

        <div className="space-y-4">

          {/* ⭐ NAME */}
          <input
            type="text"
            placeholder="Enter your name"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* ⭐ PHONE (OPTIONAL) */}
          <input
            type="tel"
            placeholder="Enter your phone number (optional)"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-400 text-sm text-center">
              {success}
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-yellow-400 hover:underline">
              Login
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}