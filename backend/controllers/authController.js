const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mailer"); 
// ✅ use shared mailer




// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: role || "user" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret123", { expiresIn: "7d" });

    res.status(201).json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || "secret123", { expiresIn: "7d" });

    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROFILE
exports.updateMe = async (req, res) => {
  try {
    const { name, bio, image, phone, address, city, dob, gender } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.image = image ?? user.image;
    user.phone = phone ?? user.phone;
    user.address = address ?? user.address;
    user.city = city ?? user.city;
    user.dob = dob ?? user.dob;
    user.gender = gender ?? user.gender;

    await user.save();

    res.json({ ...user.toObject(), password: undefined });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: ADD USER
exports.addUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: "User added", user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN: DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Not authorized" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Make sure these fields exist in your User schema
    user.resetCode = code;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    await sendEmail(
      user.email,
      "Your Password Reset Code",
      `<p>Your password reset code is: <b>${code}</b> (valid for 15 minutes)</p>`
    );

    res.json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending reset code" });
  }
};

// RESET PASSWORD + AUTO LOGIN
exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.resetCode || user.resetCode.toUpperCase() !== code.toUpperCase())
      return res.status(400).json({ message: "Invalid code" });
    if (!user.resetCodeExpires || user.resetCodeExpires < new Date())
      return res.status(400).json({ message: "Code expired" });

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    // Auto login: create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Password reset successfully",
      token,
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password" });
  }
};

