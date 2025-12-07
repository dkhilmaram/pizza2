const BoxMessage = require("../models/BoxMessage");

// Send message (anyone)
exports.sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing required fields" });
  }

  try {
    const newMessage = new BoxMessage({ name, email, subject, message });
    await newMessage.save();
    res.status(201).json({ success: true, msg: "Message sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Get all messages (admin only)
exports.getMessages = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden: Admins only" });
    }

    const messages = await BoxMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Mark message as seen (admin only)
exports.markAsSeen = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Forbidden: Admins only" });
    }

    const message = await BoxMessage.findByIdAndUpdate(
      req.params.id,
      { seen: true },
      { new: true }
    );

    if (!message) return res.status(404).json({ success: false, error: "Message not found" });

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
