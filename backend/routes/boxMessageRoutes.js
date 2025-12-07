const express = require("express");
const router = express.Router();
const boxMessageController = require("../controllers/boxMessageController");
const authMiddleware = require("../middleware/authMiddleware");

// Send message (anyone)
router.post("/", boxMessageController.sendMessage);

// Get all messages (admin only)
router.get("/", authMiddleware, boxMessageController.getMessages);

// Mark message as seen (admin only)
router.put("/seen/:id", authMiddleware, boxMessageController.markAsSeen);

module.exports = router;
