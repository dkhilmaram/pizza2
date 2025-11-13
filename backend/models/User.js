const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  bio: { type: String },
  address: { type: String },
  city: { type: String },
  dob: { type: Date },
  gender: { type: String },
  image: { type: String },
  role: { type: String, default: "user" },
  resetCode: String,
  resetCodeExpires: Date,
});

module.exports = mongoose.model("User", UserSchema);
