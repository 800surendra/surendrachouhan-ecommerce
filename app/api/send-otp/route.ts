import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOTP } from "../../lib/generateOtp";
import { db } from "../../lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, uid } = await req.json();

    if (!email || !uid) {
      return NextResponse.json(
        { error: "Email and UID are required" },
        { status: 400 }
      );
    }

    const docRef = doc(db, "emailVerifications", uid);
    const existingDoc = await getDoc(docRef);

    // 🚫 Rate limit: 60 sec me dubara OTP nahi
    if (existingDoc.exists()) {
      const data = existingDoc.data();
      const lastCreated = data.createdAt?.toDate?.();

      if (lastCreated) {
        const diff = Date.now() - lastCreated.getTime();
        if (diff < 60000) {
          return NextResponse.json(
            { error: "Please wait before requesting another OTP" },
            { status: 400 }
          );
        }
      }
    }

    // 🔐 Generate OTP
    const otp = generateOTP();

    // ⏳ Expiry 5 minutes
    const expiresAt = Timestamp.fromDate(
      new Date(Date.now() + 5 * 60 * 1000)
    );

    // 💾 Save to Firestore
    await setDoc(docRef, {
      email,
      otp,
      verified: false,
      createdAt: serverTimestamp(),
      expiresAt,
    });

    // 📧 Send Email
    await resend.emails.send({
      from: "Surendra Book Store <onboarding@resend.dev>",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#facc15;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error: any) {
    console.error("OTP Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}