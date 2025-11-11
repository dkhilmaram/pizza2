const express = require("express");
const router = express.Router();

// Correct import: matches your actual filename "authControllers.js"
const {
  register,
  login,
  getMe,
  updateMe,
  getUsers,
  addUser,
  deleteUser,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

// Admin routes
router.get("/users", authMiddleware, getUsers);
router.post("/users", authMiddleware, addUser);
router.delete("/users/:id", authMiddleware, deleteUser);

module.exports = router;
