// utils/promoNotification.js
const nodemailer = require("nodemailer");
require("dotenv").config();

/* ===============================
   1) MAIN TRANSPORTER
================================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail
    pass: process.env.EMAIL_PASS, // App password
  },
});

/* ===============================
   2) SEND PROMOTION EMAIL TO ALL USERS
================================ */
const sendPromotionEmailToAllUsers = async (users, promotion) => {
  if (!users || users.length === 0) {
    console.log("⚠ No users to notify.");
    return;
  }

const subject = `🔥 New Promotion: ${promotion.name.en || promotion.name}`;


  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color:#d62828;">🎉 New Promotion!</h2>
<h3>${promotion.name?.get ? promotion.name.get("en") : promotion.name}</h3>
    <p>${promotion.description?.get ? promotion.description.get("en") : promotion.description}</p>
      <p><strong>Price:</strong> ${promotion.price} DT</p>
      <p><strong>Code:</strong> ${promotion.code}</p>
      <p><strong>Expires on:</strong> ${new Date(promotion.expirationDate).toLocaleDateString()}</p>

      ${
        promotion.imageUrl
          ? `<img src="${promotion.imageUrl}" 
                   style="width:300px;border-radius:10px;margin-top:15px;" />`
          : ""
      }

      <p style="margin-top:20px;">
        Visit our website to use this offer! 🍽🔥
      </p>
    </div>
  `;

  for (const user of users) {
    try {
      await transporter.sendMail({
        from: `"Pizza Pete's 🍕" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html,
      });

      console.log(`📧 Promotion notification sent to: ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to send to ${user.email}:`, err.message);
    }
  }
};

module.exports = { sendPromotionEmailToAllUsers };
