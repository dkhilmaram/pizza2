const Review = require("../models/reviews");
const sendReplyNotification = require("../config/mailerComment");

// ===============================
// Ratings
// ===============================

// Get ratings histogram and average
exports.getRatings = async (req, res) => {
  try {
    const reviews = await Review.find().lean();
    const totalRaters = reviews.length;
    const average = totalRaters
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalRaters).toFixed(2)
      : 0;

    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => counts[r.rating - 1]++);
    const percentages = counts.map((c) => (totalRaters ? Math.round((c / totalRaters) * 100) : 0));

    res.json({ average, totalRaters, percentages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add or update a rating (one per user)
exports.createOrUpdateReview = async (req, res) => {
  try {
    const { rating } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: "Invalid rating" });

    let review = await Review.findOne({ userId: req.user._id });
    if (review) {
      review.rating = rating;
      await review.save();
      return res.json({ success: true, message: "Rating updated!", review });
    }

    const emailMasked = req.user.email[0] + "***@" + req.user.email.split("@")[1];

    review = await Review.create({
      name: req.user.name,
      email: req.user.email,
      emailMasked,
      rating,
      userId: req.user._id,
      comments: [],
    });

    res.json({ success: true, message: "Rating submitted!", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user's rating
exports.getUserReview = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const review = await Review.findOne({ userId: req.user._id }).lean();
    res.json({ rating: review?.rating || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===============================
// Comments
// ===============================

exports.getComments = async (req, res) => {
  try {
    const reviews = await Review.find().lean();
    const allComments = [];

    reviews.forEach((r) => {
      if (r.comments && r.comments.length > 0) {
        r.comments.forEach((c) => {
          allComments.push({
            _id: c._id.toString(),
            text: c.text,
            userId: c.userId.toString(),
            name: r.name,

            // 🔥 👉 Show real email except for admin
            email: r.email === "admin@gmail.com" ? r.emailMasked : r.email,

            replies: c.replies?.map((rep) => ({
              _id: rep._id.toString(),
              text: rep.text,
              adminId: rep.adminId?.toString(),
              adminName: rep.adminName,
              userId: rep.userId?.toString(),
              userName: rep.userName,
            })) || [],
          });
        });
      }
    });

    res.json(allComments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Add a comment (multiple comments per user)
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!text || !text.trim()) return res.status(400).json({ message: "Comment cannot be empty" });

    // Find or create review document
    let review = await Review.findOne({ userId: req.user._id });
    if (!review) {
      const emailMasked = req.user.email[0] + "***@" + req.user.email.split("@")[1];
      review = await Review.create({
        name: req.user.name,
        email: req.user.email,
        emailMasked,
        rating: 0,
        userId: req.user._id,
        comments: [],
      });
    }

    review.comments.push({ text, userId: req.user._id });
    await review.save();

    res.json({ success: true, message: "Comment added!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId; // ✅ correct source
    const { text } = req.body;

    if (!text || !commentId) {
      return res.status(400).json({ message: "Missing text or commentId" });
    }

    // Find the review containing this comment
    const review = await Review.findOne({ "comments._id": commentId });
    if (!review) return res.status(404).json({ message: "Comment not found" });

    // Extract the comment subdocument
    const comment = review.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only the comment owner can edit
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this comment" });
    }

    // Update the text
    comment.text = text;

    // Save the parent document
    await review.save();

    res.json({ success: true, message: "Comment updated", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const review = await Review.findOne({ "comments._id": commentId });
    if (!review) return res.status(404).json({ message: "Comment not found" });

    const commentIndex = review.comments.findIndex((c) => c._id.toString() === commentId);

    if (review.comments[commentIndex].userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this comment" });
    }

    review.comments.splice(commentIndex, 1);
    await review.save();

    res.json({ success: true, message: "Comment deleted!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reply to a comment (users and admins)
// Reply to a comment (users and admins)
exports.replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!text || !text.trim()) return res.status(400).json({ message: "Reply cannot be empty" });

    const review = await Review.findOne({ "comments._id": commentId });
    if (!review) return res.status(404).json({ message: "Comment not found" });

    const comment = review.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.replies = comment.replies || [];

    let reply;

    if (req.user.role === "admin") {
      reply = {
        text,
        adminName: req.user.name,
        adminId: req.user._id,
      };
    } else {
      reply = {
        text,
        userName: req.user.name,
        userId: req.user._id,
      };
    }

    comment.replies.push(reply);
    await review.save();

    // -------------------------------
    // EMAIL NOTIFICATION (NEW)
    // -------------------------------
    const originalUserId = comment.userId?.toString();
    const replierId = req.user._id.toString();

    // Prevent emailing yourself
    if (originalUserId !== replierId && review.email) {
      sendReplyNotification(review.email, review.name, text)
        .catch(err => console.error("Email notification error:", err));
    }

    res.json({ success: true, message: "Reply added!" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
