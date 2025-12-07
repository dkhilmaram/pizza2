const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  coupon: { type: String, default: "" },
  discount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "preparing", "delivering", "completed", "canceled"],
    default: "pending"
  },
  address: { type: String, required: true },
  phone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
