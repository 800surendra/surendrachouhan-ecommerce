"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [uid, setUid] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 UID localStorage se lo
  useEffect(() => {
    const storedUid = localStorage.getItem("verify_uid");
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  const handleVerify = async () => {
    if (!otp) return setError("Enter OTP");
    if (!uid) return setError("User not authenticated");

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      // OTP doc delete ho jayega backend me
      localStorage.removeItem("verify_uid");

      router.push("/login");

    } catch {
      setError("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Verify OTP
        </h1>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-3 bg-gray-800 rounded mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-2 rounded font-bold"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </main>
  );
}