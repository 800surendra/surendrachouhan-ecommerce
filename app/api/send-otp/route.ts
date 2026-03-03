import { NextResponse } from "next/server";
import SibApiV3Sdk from "sib-api-v3-sdk";
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

    // 🔥 Save OTP in Firestore
    await setDoc(doc(db, "emailVerifications", uid), {
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // ==============================
    // 🔥 BREVO CONFIG
    // ==============================

    const client = SibApiV3Sdk.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY!

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    await apiInstance.sendTransacEmail({
      sender: {
        email: "8000haresh@gmail.com", // 🔥 Yahan apna verified gmail dalna
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
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Brevo Error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}