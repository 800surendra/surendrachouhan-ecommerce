import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function POST(req: Request) {

  try {

    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: "Missing email or uid" },
        { status: 400 }
      );
    }

    const otpRef = doc(db, "emailVerifications", uid);

    const existing = await getDoc(otpRef);

    // 🔒 Rate limit (30 sec)
    if (existing.exists()) {

      const data = existing.data();

      if (data.lastSentAt) {

        const last = new Date(data.lastSentAt);
        const now = new Date();

        const diff = (now.getTime() - last.getTime()) / 1000;

        if (diff < 30) {

          return NextResponse.json(
            {
              error: "Please wait 30 seconds before requesting another OTP"
            },
            { status: 429 }
          );

        }

      }

    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ⏱ Expiry (5 min)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // 🔥 Save OTP
    await setDoc(otpRef, {

      email,
      otp,
      expiresAt,
      lastSentAt: new Date().toISOString()

    });

    // 📧 Send email via Brevo
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY as string
      },

      body: JSON.stringify({

        sender: {
          name: "Surendra Book Store",
          email: "8000haresh@gmail.com"
        },

        to: [{ email }],

        subject: "Verify your email | Surendra Book Store",

        htmlContent: `
        <div style="font-family:Arial;padding:20px">

        <h2 style="color:#111">
        Surendra Book Store
        </h2>

        <p>Hello,</p>

        <p>Your email verification code is:</p>

        <h1 style="
        background:#000;
        color:#facc15;
        padding:10px;
        display:inline-block;
        letter-spacing:5px;
        ">
        ${otp}
        </h1>

        <p>This OTP will expire in <b>5 minutes</b>.</p>

        <p>If you did not request this, please ignore this email.</p>

        </div>
        `
      })

    });

    if (!response.ok) {

      const error = await response.text();

      console.error("Brevo error:", error);

      throw new Error("Email sending failed");

    }

    return NextResponse.json({

      success: true,
      message: "OTP sent successfully"

    });

  }

  catch (error) {

    console.error("Send OTP Error:", error);

    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );

  }

}