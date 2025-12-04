const Promotion = require("../models/promotions");
const { sendPromotionEmailToAllUsers } = require("../config/promonotification");
const User = require("../models/User"); // your user model

// 📌 Get all promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Create a promotion
exports.createPromotion = async (req, res) => {
  try {
    const { name, description, expirationDate, code, price, imageUrl } = req.body;

    const promotion = new Promotion({
      name,
      description,
      expirationDate,
      code,
      price,
      imageUrl,
    });

    const savedPromotion = await promotion.save();

    // Fetch all users
    const users = await User.find({});

    // Send email notification
    await sendPromotionEmailToAllUsers(users, savedPromotion);

    res.status(201).json(savedPromotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Update a promotion by ID
exports.updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Promotion.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    // Fetch all users
    const users = await User.find({});

    // Send email notification
    await sendPromotionEmailToAllUsers(users, updated);

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📌 Delete a promotion by ID
exports.deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Promotion.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
