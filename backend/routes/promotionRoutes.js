const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} = require("../controllers/promotionController");

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admins only" });
  next();
};

// Routes

// 1️⃣ Anyone (guest or logged in) can see promotions
router.get("/", getAllPromotions);

// 2️⃣ Only admins can create, update, delete
router.post("/", auth, requireAdmin, createPromotion);
router.put("/:id", auth, requireAdmin, updatePromotion);
router.delete("/:id", auth, requireAdmin, deletePromotion);

module.exports = router;
