const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../config/mailer");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, bio, address, city, dob, gender, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All required fields must be filled" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const normalizedRole = role === "actor" ? "user" : role || "user";

    const user = await User.create({
      name, email, password: hashed, phone, bio, address, city, dob, gender, role: normalizedRole
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

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

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token, user: { ...user.toObject(), password: undefined } });
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
    user.resetCode = code;
    user.resetCodeExpires = new Date(Date.now() +  60 * 1000); // 
    await user.save();

    await sendEmail(user.email, "Your Password Reset Code", `<p>Your code is: <b>${code}</b> (valid for one minute)</p>`);

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

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

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
