// menuNotification.js
const nodemailer = require("nodemailer");
require("dotenv").config();

/* ===============================
   1) MAIN TRANSPORTER
================================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail
    pass: process.env.EMAIL_PASS, // App password only
  },
});

/* ===============================
   2) SEND NEW MENU EMAIL TO ALL USERS
================================ */
const sendNewMenuEmailToAllUsers = async (users, menuItem) => {
  if (!users || users.length === 0) {
    console.log("⚠ No users to notify.");
    return;
  }

  const subject = `🔥 New Menu Item Added: ${menuItem.name}`;

  const html = `
    <div style="font-family: Arial; padding: 20px;">
      <h2 style="color:#d62828;">🍕 New Menu Added!</h2>

      <p>We just added a brand new dish to our menu!</p>

      <h3>${menuItem.name}</h3>
      <p><strong>Price:</strong> ${menuItem.price} DT</p>
      <p><strong>Ingredients:</strong> ${menuItem.ingredients}</p>

      ${
        menuItem.img
          ? `<img src="${menuItem.img}" 
                   style="width:300px;border-radius:10px;margin-top:15px;" />`
          : ""
      }

      <p style="margin-top:20px;">
        Visit our website to place an order! 🍽🔥
      </p>
    </div>
  `;

  // Send to each user
  for (const user of users) {
    try {
      await transporter.sendMail({
        from: `"Pizza Pete's 🍕" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject,
        html,
      });

      console.log(`📧 Menu notification sent to: ${user.email}`);
    } catch (err) {
      console.error(`❌ Failed to send to ${user.email}:`, err.message);
    }
  }
};

module.exports = { sendNewMenuEmailToAllUsers };
