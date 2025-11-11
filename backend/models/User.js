const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  dob: { type: Date },
  gender: { type: String },
  image: { type: String, default: "" },
  role: { type: String, default: "user" },

  // Add these fields for password reset
  resetCode: { type: String },
  resetCodeExpires: { type: Date },
});

module.exports = mongoose.model("User", UserSchema);
