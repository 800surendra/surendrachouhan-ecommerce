"use client";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
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
      const user = userCredential.user;

      // 👤 Save user in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role: "user",
        createdAt: new Date(),
      });

      // 📧 Send OTP
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
        }),
      });

      setSuccess("OTP sent to your email. Please verify your account.");

      // 👉 Redirect to Verify Page
      setTimeout(() => router.push("/verify"), 1500);

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
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
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