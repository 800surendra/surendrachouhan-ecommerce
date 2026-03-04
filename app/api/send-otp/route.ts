import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: "Missing email or uid" },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in Firestore
    await setDoc(doc(db, "emailVerifications", uid), {
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email using Brevo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        sender: {
          name: "Surendra Book Store",
          email: "8000haresh@gmail.com",
        },
        to: [{ email }],
        subject: "Your OTP Code",
        htmlContent: `
          <div style="font-family:sans-serif">
            <h2>Email Verification</h2>
            <p>Your OTP code is:</p>
            <h1>${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo Error:", errorData);
      throw new Error("Email sending failed");
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent",
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}