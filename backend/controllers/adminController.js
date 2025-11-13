const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    const users = await User.find().select("-password");

    const normalizedUsers = users.map(u => {
      const role = u.role === "actor" ? "user" : u.role;
      return { ...u.toObject(), role };
    });

    res.json(normalizedUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD USER
exports.addUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    const { name, email, password, phone, bio, address, city, dob, gender, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const normalizedRole = role === "actor" ? "user" : role;

    const user = await User.create({ name, email, password: hashed, phone, bio, address, city, dob, gender, role: normalizedRole });

    res.status(201).json({
      message: "User added successfully",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER ROLE
exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    let { role } = req.body;
    if (!role) return res.status(400).json({ message: "Role is required" });

    role = role === "actor" ? "user" : role;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.email === "admin@gmail.com")
      return res.status(403).json({ message: "Modification impossible sur ce compte." });

    user.role = role;
    await user.save();

    res.json({
      message: "Rôle mis à jour avec succès",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
