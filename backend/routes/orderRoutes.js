const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getMyOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const authMiddleware = require("../middleware/authMiddleware");

// All routes require authentication
router.use(authMiddleware);

// User routes
router.get("/me", getMyOrders);
router.post("/", createOrder);

// Admin routes
router.get("/", (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}, getAllOrders);

router.put("/:id", (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}, updateOrderStatus);

router.delete("/:id", (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  next();
}, deleteOrder);

module.exports = router;
