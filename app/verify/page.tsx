"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {

  const router = useRouter();

  const [uid, setUid] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  // 🔑 UID load
  useEffect(() => {

    const storedUid = localStorage.getItem("verify_uid");

    if (storedUid) {
      setUid(storedUid);
    }

  }, []);

  // ⏱ Countdown timer
  useEffect(() => {

    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  // OTP change
  const handleChange = (value: string, index: number) => {

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

  };

  // backspace
  const handleKeyDown = (e: any, index: number) => {

    if (e.key === "Backspace" && !otp[index] && index > 0) {

      inputs.current[index - 1]?.focus();

    }

  };

  // combine OTP
  const getOtp = () => otp.join("");

  // Verify OTP
  const handleVerify = async () => {

    const code = getOtp();

    if (code.length !== 6) {
      return setError("Enter complete OTP");
    }

    if (!uid) {
      return setError("User not authenticated");
    }

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
          otp: code,
        }),

      });

      const data = await res.json();

      if (!res.ok) {

        setError(data.error);

        return;

      }

      localStorage.removeItem("verify_uid");

      router.push("/login");

    } catch {

      setError("Verification failed");

    } finally {

      setLoading(false);

    }

  };

  // resend OTP
  const handleResend = async () => {

    if (timer > 0) return;

    try {

      const res = await fetch("/api/send-otp", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          uid,
        }),

      });

      const data = await res.json();

      if (!res.ok) {

        setError(data.error);

        return;

      }

      setTimer(30);

    } catch {

      setError("Failed to resend OTP");

    }

  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-black text-white px-4">

      <div className="bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md text-center">

        <h1 className="text-3xl font-bold mb-2">
          Verify Email
        </h1>

        <p className="text-gray-400 mb-6">
          Enter the 6 digit code sent to your email
        </p>

        {/* OTP BOXES */}

        <div className="flex justify-center gap-3 mb-6">

          {otp.map((digit, index) => (

            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => {
  inputs.current[index] = el;
}}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl rounded-lg bg-gray-800 border border-gray-700 focus:border-yellow-400 outline-none"
            />

          ))}

        </div>

        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold hover:bg-yellow-300 transition"
        >

          {loading ? "Verifying..." : "Verify OTP"}

        </button>

        {/* RESEND */}

        <div className="mt-6 text-sm">

          {timer > 0 ? (

            <p className="text-gray-400">
              Resend OTP in {timer}s
            </p>

          ) : (

            <button
              onClick={handleResend}
              className="text-yellow-400 hover:underline"
            >
              Resend OTP
            </button>

          )}

        </div>

      </div>

    </main>

  );

}