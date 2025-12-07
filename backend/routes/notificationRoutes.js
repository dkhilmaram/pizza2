const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all notifications for logged-in user
router.get("/", authMiddleware, notificationController.getNotifications);

// Mark a notification as read
router.put("/:notificationId/read", authMiddleware, notificationController.markAsRead);

module.exports = router;
