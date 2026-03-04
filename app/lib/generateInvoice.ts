import jsPDF from "jspdf";

export function generateInvoice(order:any) {

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("Surendra Book Store", 20, 20);

  doc.setFontSize(14);
  doc.text("Invoice", 20, 40);

  doc.setFontSize(11);

  doc.text(`Order ID: ${order.id}`, 20, 60);
  doc.text(`Customer: ${order.userEmail}`, 20, 70);

  let y = 90;

  order.items.forEach((item:any) => {

    doc.text(
      `${item.title} x${item.quantity}`,
      20,
      y
    );

    doc.text(
      `₹${item.price * item.quantity}`,
      160,
      y
    );

    y += 10;

  });

  doc.text(`Delivery: ₹${order.deliveryFee}`, 20, y + 10);

  doc.setFontSize(16);
  doc.text(`Total: ₹${order.total}`, 20, y + 30);

  doc.text("Thank you for your purchase!", 20, y + 50);

  return doc.output("blob");
}