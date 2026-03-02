"use client";

import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return setError("Please fill all fields");
    }

    try {
      setLoading(true);
      setError("");

      await login(email, password);

      router.push("/");
    } catch (err: any) {
      let message = "Login failed. Please try again.";

      /* ===== Email Not Verified Handling ===== */
      if (err.message === "EMAIL_NOT_VERIFIED") {
        message =
          "Please verify your email before logging in. Check your inbox.";
      }

      /* ===== Firebase Error Handling ===== */
      else if (err.code === "auth/invalid-email") {
        message = "Invalid email format.";
      } else if (err.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (err.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-6">
      <div className="bg-gray-900/80 backdrop-blur p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-800">

        <h1 className="text-3xl font-bold mb-2 text-center">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 text-sm text-center mb-6">
          Login to Surendra Book Store
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 bg-gray-800 rounded-lg outline-none focus:ring-2 focus:ring-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-yellow-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-gray-400 text-sm text-center mt-4">
            Don’t have an account?{" "}
            <Link href="/register" className="text-yellow-400 hover:underline">
              Register
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}