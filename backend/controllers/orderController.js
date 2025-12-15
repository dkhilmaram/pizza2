const Order = require("../models/Order");
const sendStatusEmail = require("../config/mailerStatus");

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: Get my orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, address, phone, coupon, discount } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      totalPrice,
      coupon: coupon || "",
      discount: discount || 0,
      address,
      phone
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Update order status
// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === status) {
      return res.status(400).json({ message: "Status is already the same" });
    }

    order.status = status;
    await order.save(); // save first

    // Fire-and-forget email
    sendStatusEmail({
      to: order.user.email,
      userName: order.user.name,
      orderId: order._id,
      status: order.status,
    }).catch(err => console.error("Failed to send status email:", err.message));

    res.json(order); // respond immediately
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
