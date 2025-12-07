const nodemailer = require("nodemailer");
require("dotenv").config(); // Make sure this is loaded

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // app password, NOT normal password
  },
});

// Verify connection (optional but helpful)
transporter.verify((err, success) => {
  if (err) console.log("SMTP Error:", err);
  else console.log("SMTP Ready to send messages");
});

// Send status email
const sendStatusEmail = async ({ to, userName, orderId, status }) => {
  if (!to) throw new Error("Recipient email is required");

  const subject = `Order #${orderId.toString().slice(0, 8)} Status Updated`;
  const text = `
Hello ${userName},

Your order status is ${status.toUpperCase()}.

Thank you for ordering with us!

🍕 Pizza Pete's
  `;

  try {
    await transporter.sendMail({
      from: `"Pizza Pete's 🍕" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log(`📧 Status email sent to ${to}`);
  } catch (err) {
    console.error("Failed to send email:", err.message);
    throw err;
  }
};

module.exports = sendStatusEmail;
