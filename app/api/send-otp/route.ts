import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    // 🔥 Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔥 Save OTP in Firestore (10 min expiry)
    await setDoc(doc(db, "emailVerifications", uid), {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // ==============================
    // 🔥 BREVO FETCH API (No SDK)
    // ==============================

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        sender: {
          email: "8000haresh@gmail.com", // ⚠ Must be verified in Brevo
          name: "Surendra Book Store",
        },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API Error:", errorData);
      throw new Error("Email sending failed");
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}