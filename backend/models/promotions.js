const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    name: { type: Map, of: String, required: true }, // multilingual
    description: { type: Map, of: String, required: true },
    expirationDate: { type: Date, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },

    // ⭐ NEW FIELD — required for your AdminPromotionPage
    discount: { type: Number, default: 0 }, // stored as decimal (0.10 = 10%)

    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Promotion", PromotionSchema);
