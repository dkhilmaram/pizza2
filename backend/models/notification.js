const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who receives
  type: { type: String, default: "reply" },
  commentId: { type: mongoose.Schema.Types.ObjectId },
  replyId: { type: mongoose.Schema.Types.ObjectId },
  text: String, // e.g. "Admin replied to your comment"
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Notification", notificationSchema);
