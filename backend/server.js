// server.js
require("dotenv").config(); // Load environment variables first
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoute");
const boxMessageRoutes = require("./routes/boxMessageRoutes"); // <-- New

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: ["http://localhost:3000"], // React frontend
    credentials: true,
  })
);

// Routes

// Authentication routes
app.use("/api/auth", authRoutes);

// User profile routes (protected)
app.use("/api/user", userRoutes);

// Admin routes (protected, admin only)
app.use("/api/admin", adminRoutes);

// Orders routes
app.use("/api/orders", orderRoutes);

// Reviews routes
app.use("/api/reviews", reviewRoutes);

// BoxMessage routes (contact messages)
app.use("/api/boxmessages", boxMessageRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🍕 Pizza App API is running!");
});

// Connect to DB and start server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
  });
