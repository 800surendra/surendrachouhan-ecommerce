"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../context/AuthContext";
import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* ================= AUTH SAFE ================= */

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const fetchOrder = async () => {
      const ref = doc(db, "orders", params.id as string);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      const data = snap.data();

      if (data.userId !== user.uid) {
        router.push("/orders");
        return;
      }

      setOrder({ id: snap.id, ...data });
      setLoading(false);
    };

    fetchOrder();
  }, [user, authLoading, params.id, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading Invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Invoice Not Found
      </div>
    );
  }

  /* ================= SAFE CALCULATION ================= */

  const items = Array.isArray(order.items) ? order.items : [];

  const subtotal =
    items.length > 0
      ? items.reduce(
          (sum: number, item: any) =>
            sum +
            (Number(item.price) || 0) *
              (Number(item.quantity) || 0),
          0
        )
      : Number(order.subtotal) || 0;

  const deliveryFee = Number(order.deliveryFee) || 0;
  const gst = subtotal * 0.18;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const total = subtotal + gst + deliveryFee;

  /* ================= PDF ================= */

  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(18);
    pdf.text("Surendra Book Store", 20, 20);

    pdf.setFontSize(11);
    pdf.text(`Invoice ID: ${order.id}`, 20, 35);
    pdf.text(
      `Date: ${order.createdAt?.toDate().toLocaleString()}`,
      20,
      42
    );

    let y = 60;

    pdf.text("Item", 20, y);
    pdf.text("Qty", 120, y);
    pdf.text("Amount", 180, y, { align: "right" });

    y += 6;
    pdf.line(20, y, 190, y);
    y += 10;

    items.forEach((item: any) => {
      pdf.text(item.title, 20, y);
      pdf.text(String(item.quantity), 125, y);
      pdf.text(
        `Rs. ${(Number(item.price) || 0) *
          (Number(item.quantity) || 0)}`,
        180,
        y,
        { align: "right" }
      );
      y += 8;
    });

    y += 10;

    pdf.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 180, y, {
      align: "right",
    });
    y += 8;

    pdf.text(`CGST (9%): Rs. ${cgst.toFixed(2)}`, 180, y, {
      align: "right",
    });
    y += 8;

    pdf.text(`SGST (9%): Rs. ${sgst.toFixed(2)}`, 180, y, {
      align: "right",
    });
    y += 8;

    pdf.text(`Delivery: Rs. ${deliveryFee.toFixed(2)}`, 180, y, {
      align: "right",
    });
    y += 12;

    pdf.setFont("helvetica", "bold");
    pdf.text(`Total: Rs. ${total.toFixed(2)}`, 180, y, {
      align: "right",
    });

    const qrData = `Order: ${order.id}\nTotal: Rs.${total}`;
    const qr = await QRCode.toDataURL(qrData);
    pdf.addImage(qr, "PNG", 20, 210, 40, 40);

    pdf.save(`Invoice-${order.id}.pdf`);
  };

  /* ================= UI ================= */

  return (
    <main className="min-h-screen bg-black text-white px-6 md:px-16 py-16">
      <div className="max-w-4xl mx-auto bg-gray-900 p-10 rounded-3xl border border-gray-800 shadow-2xl">

        <div className="flex justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              🧾 Tax Invoice
            </h1>
            <p className="text-gray-400 mt-2">
              Order ID: {order.id}
            </p>
          </div>

          <button
            onClick={downloadPDF}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-300 transition"
          >
            Download PDF
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between bg-gray-800 p-4 rounded-xl"
            >
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>
                ₹
                {(Number(item.price) || 0) *
                  (Number(item.quantity) || 0)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-right space-y-2">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>CGST: ₹{cgst.toFixed(2)}</p>
          <p>SGST: ₹{sgst.toFixed(2)}</p>
          <p>Delivery: ₹{deliveryFee.toFixed(2)}</p>

          <p className="text-2xl font-bold text-yellow-400 mt-4">
            Total: ₹{total.toFixed(2)}
          </p>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push("/orders")}
            className="border border-yellow-400 px-6 py-2 rounded-full hover:bg-yellow-400 hover:text-black transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    </main>
  );
}