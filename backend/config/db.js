const mongoose = require("mongoose");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // adjust path if needed

const adminEmail = "admin@gmail.com";
const adminPassword = "258369147";

const connectDB = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pizza-petes", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");

    // 2️⃣ Ensure admin exists (do NOT overwrite existing)
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        bio: "",
        image: "",
      });
      console.log("✅ Admin created in DB");
    } else {
      console.log("Admin already exists (not modified)");
    }

    // 3️⃣ Print all users for verification
    const allUsers = await User.find({});
    console.log(`👥 Total users in DB: ${allUsers.length}`);
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - role: ${user.role}`);
    });

  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

// Optional: connect immediately if this file is run directly
if (require.main === module) {
  connectDB();
}
