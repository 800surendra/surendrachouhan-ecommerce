import * as admin from "firebase-admin";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "surendrachouhan8", // 👈 apna gmail
    pass: "8000411638@haresh",    // 👈 gmail app password
  },
});

// Trigger when order is updated
export const sendOrderConfirmationEmail = onDocumentUpdated(
  "orders/{orderId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) return;

    // Only send when paymentStatus changes to "Verified"
    if (
      beforeData.paymentStatus !== "Verified" &&
      afterData.paymentStatus === "Verified"
    ) {
      const mailOptions = {
        from: "Surendra Book Store <YOUR_GMAIL@gmail.com>",
        to: afterData.userEmail,
        subject: "Order Confirmed - Surendra Book Store",
        html: `
          <h2>Thank you for your order!</h2>
          <p><strong>Order ID:</strong> ${event.params.orderId}</p>
          <p><strong>Total:</strong> ₹${afterData.total}</p>
          <p>Your payment has been verified successfully.</p>
          <p>Your order will be delivered soon.</p>
          <br/>
          <p>Regards,<br/>Surendra Book Store</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    }
  }
);