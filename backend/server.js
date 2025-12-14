require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Seeder
const seedPizzas = require("./util/pizzaseeds");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoutes = require("./routes/reviewRoute");
const boxMessageRoutes = require("./routes/boxMessageRoutes"); 
const promotionRoutes = require("./routes/promotionRoutes");
const menuRoutes = require("./routes/menuRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);




// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/boxmessages", boxMessageRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/pizzas", menuRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("🍕 Pizza App API is running!");
});

// Connect DB + Seed default pizzas
connectDB()
  .then(async () => {
    await seedPizzas();  // <--- AUTO INSERT PIZZAS ONLY IF DB EMPTY

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Failed to connect to DB:", err.message);
  });
