const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    pizzaId: {
      type: String,
      required: true
    },

    pizzaData: {
      type: Object,
      required: true
    }
  },
  { timestamps: true }
);

/**
 * One pizza can be favorited only once per user
 */
favoriteSchema.index({ user: 1, pizzaId: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
