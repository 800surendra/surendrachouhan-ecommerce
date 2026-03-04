import { NextResponse } from "next/server";
import { db } from "@/app/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { uid, otp } = await req.json();

    if (!uid || !otp) {
      return NextResponse.json(
        { error: "Missing uid or otp" },
        { status: 400 }
      );
    }

    const otpRef = doc(db, "emailVerifications", uid);
    const snap = await getDoc(otpRef);

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "OTP not found" },
        { status: 400 }
      );
    }

    const data = snap.data();

    // OTP mismatch
    if (data.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Expiry check
    const expiry = new Date(data.expiresAt);
    if (expiry < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // Update user verified
    await updateDoc(doc(db, "users", uid), {
      emailVerified: true,
    });

    // Delete OTP document
    await deleteDoc(otpRef);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}