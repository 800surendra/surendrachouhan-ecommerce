import { NextResponse } from "next/server";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const snap = await getDoc(doc(db, "orders", orderId));

    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = snap.data();

    const invoiceLink = `${process.env.NEXT_PUBLIC_SITE_URL}/invoice/${orderId}`;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          name: "Surendra Book Store",
          email: "8000haresh@gmail.com", // ⚠️ yaha apna verified email daalo
        },
        to: [
          {
            email: order.userEmail,
          },
        ],
        subject: "Your Payment is Verified ✅ | Invoice Inside",
        htmlContent: `
          <div style="font-family:Arial;padding:20px">
            <h2>Payment Verified Successfully 🎉</h2>
            <p>Your order <b>${orderId}</b> has been verified.</p>
            <p>Total Paid: ₹${order.total}</p>
            <p>
              Download your invoice here:
              <a href="${invoiceLink}">View Invoice</a>
            </p>
            <br/>
            <p>Thank you for shopping with Surendra Book Store.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("Brevo email failed");
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}