const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// ===============================
// Ratings
// ===============================
router.get("/ratings", reviewController.getRatings);                       // Get histogram & average
router.post("/", authMiddleware, reviewController.createOrUpdateReview);   // Add/update rating
router.get("/user", authMiddleware, reviewController.getUserReview);       // Get current user's rating

// ===============================
// Comments
// ===============================
// Get all comments (no auth needed)
router.get("/comments", reviewController.getComments);

// Add a comment (requires auth)
router.post("/comments", authMiddleware, reviewController.addComment);

// Update a comment (only owner)
router.put("/comments/:commentId", authMiddleware, reviewController.updateComment);

// Delete a comment (only owner)
router.delete("/comments/:commentId", authMiddleware, reviewController.deleteComment);

// Reply to a comment (users and admins)
router.post("/comments/:commentId/replies", authMiddleware, reviewController.replyToComment);

module.exports = router;
