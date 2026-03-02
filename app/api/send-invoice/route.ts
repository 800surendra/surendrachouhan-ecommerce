import { NextResponse } from "next/server";
import { Resend } from "resend";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    const snap = await getDoc(doc(db, "orders", orderId));

    if (!snap.exists()) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = snap.data();

    const invoiceLink = `${process.env.NEXT_PUBLIC_SITE_URL}/invoice/${orderId}`;

    await resend.emails.send({
      from: "Surendra Book Store <onboarding@resend.dev>",
      to: order.userEmail,
      subject: "Your Payment is Verified ✅ | Invoice Inside",
      html: `
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
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}