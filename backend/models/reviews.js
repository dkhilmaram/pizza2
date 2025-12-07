const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  userId: mongoose.Schema.Types.ObjectId,
  replies: [
    {
      text: String,
      adminId: mongoose.Schema.Types.ObjectId,
      adminName: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const reviewSchema = new mongoose.Schema({
  name: String,
  email: String,
  emailMasked: String,
  rating: Number,
  userId: mongoose.Schema.Types.ObjectId,
  comments: [commentSchema],
});

module.exports = mongoose.model("Review", reviewSchema);
