const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  deleteUser,
  updateUserRole
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin routes
router.get("/users", authMiddleware, getUsers);
router.post("/users", authMiddleware, addUser);
router.delete("/users/:id", authMiddleware, deleteUser);
router.patch("/users/:id/role", authMiddleware, updateUserRole);

module.exports = router;
