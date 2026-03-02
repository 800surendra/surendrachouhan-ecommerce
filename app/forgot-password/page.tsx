"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    try {
      setError("");
      setMessage("");

      await resetPassword(email);

      setMessage("Password reset link sent! Check your email.");
    } catch (err: any) {
      setError("Failed to send reset email.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-gray-900 p-8 rounded-3xl w-full max-w-md shadow-xl">

        <h1 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
          Reset Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 rounded bg-gray-800 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {message && (
          <p className="text-green-400 text-sm text-center mb-3">
            {message}
          </p>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <button
          onClick={handleReset}
          className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-300 transition"
        >
          Send Reset Link
        </button>

        <Link
          href="/login"
          className="block text-center mt-6 text-yellow-400 hover:underline"
        >
          Back to Login
        </Link>

      </div>
    </main>
  );
}