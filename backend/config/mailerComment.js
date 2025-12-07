// config/commentMailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendReplyNotification = async (to, username, replyText) => {
  try {
    await transporter.sendMail({
      from: `"Pizza Pete's 🍕" <${process.env.EMAIL_USER}>`,
      to,
      subject: "You received a reply to your comment!",
      text: `
Hello ${username},

Someone just replied to your comment:

"${replyText}"

Visit the website to view the conversation.

Cheers!
Pizza Pete's 🍕 Team
      `,
    });

    console.log("📧 Reply notification email sent to:", to);
  } catch (err) {
    console.error("Email sending error:", err.message);
    throw err;
  }
};

module.exports = sendReplyNotification;
