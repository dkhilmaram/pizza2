// server.js
require("dotenv").config(); // ✅ Load environment variables FIRST
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// ✅ Increase JSON limit for image uploads
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cors());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// ✅ Connect to DB, then start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
});
