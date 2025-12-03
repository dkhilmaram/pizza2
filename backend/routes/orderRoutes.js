const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orderController");

const auth = require("../middleware/authMiddleware");

// Require admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admins only" });
  next();
};

// All routes need auth
router.use(auth);

// User routes
router.get("/me", getMyOrders);
router.post("/", createOrder);

// Admin routes
router.get("/", requireAdmin, getAllOrders);
router.put("/:id", requireAdmin, updateOrderStatus);
router.delete("/:id", requireAdmin, deleteOrder);

module.exports = router;
