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
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // check if the user owns the order (security)
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin routes
router.get("/", requireAdmin, getAllOrders);
router.put("/:id", requireAdmin, updateOrderStatus);
router.delete("/:id", requireAdmin, deleteOrder);

module.exports = router;
