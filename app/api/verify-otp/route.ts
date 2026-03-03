import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { uid, otp } = await req.json();

    if (!uid || !otp) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    const otpRef = doc(db, "emailVerifications", uid);
    const otpSnap = await getDoc(otpRef);

    if (!otpSnap.exists()) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const data = otpSnap.data();

    // OTP mismatch
    if (data.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Expired check
    if (data.expiresAt.toDate() < new Date()) {
      return NextResponse.json(
        { error: "OTP expired" },
        { status: 400 }
      );
    }

    // 🔥 Update user document
    await updateDoc(doc(db, "users", uid), {
      emailVerified: true,
    });

    // 🔥 Clean up OTP document
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