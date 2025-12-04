const express = require("express");
const router = express.Router();
const { getMe, updateMe } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected user routes
// GET current user info, must include role
router.get("/me", authMiddleware, getMe);

// UPDATE current user info
router.put("/me", authMiddleware, updateMe);

module.exports = router;
