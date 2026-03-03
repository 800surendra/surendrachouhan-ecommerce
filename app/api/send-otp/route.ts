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
  subject: "🔐 Your Surendra Book Store OTP Code",
  
  text: `
Surendra Book Store

Your One-Time Password (OTP) is: ${otp}

This OTP will expire in 5 minutes.
If you did not request this, please ignore this email.
  `,

  html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9fafb;">
    <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
      
      <h2 style="text-align:center; color:#111827;">
        Surendra Book Store
      </h2>

      <p style="font-size:16px; color:#374151;">
        Your One-Time Password (OTP) is:
      </p>

      <div style="text-align:center; margin: 20px 0;">
        <span style="
          display:inline-block;
          font-size:28px;
          font-weight:bold;
          letter-spacing:4px;
          background:#facc15;
          padding:10px 20px;
          border-radius:6px;
          color:#111827;
        ">
          ${otp}
        </span>
      </div>

      <p style="font-size:14px; color:#6b7280;">
        This OTP will expire in <strong>5 minutes</strong>.
      </p>

      <p style="font-size:12px; color:#9ca3af;">
        If you did not request this, please ignore this email.
      </p>

    </div>
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