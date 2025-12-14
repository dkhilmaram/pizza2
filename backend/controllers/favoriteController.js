const Favorite = require("../models/Favorites");

/**
 * GET /api/favorites
 * Get logged-in user's favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id });

    // Map to frontend-friendly format
    const pizzaList = favorites.map(f => ({
      _id: f.pizzaId,           // ensures frontend can use _id
      ...f.pizzaData
    }));

    res.json(pizzaList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};

/**
 * POST /api/favorites
 * Add pizza to favorites
 */
exports.addFavorite = async (req, res) => {
  try {
    const pizza = req.body;
    const pizzaId = pizza.id || pizza._id;

    if (!pizza || !pizzaId) {
      return res.status(400).json({ message: "Invalid pizza data" });
    }

    await Favorite.findOneAndUpdate(
      { user: req.user._id, pizzaId },
      { user: req.user._id, pizzaId, pizzaData: pizza },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Favorite added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add favorite" });
  }
};

/**
 * DELETE /api/favorites/:pizzaId
 * Remove pizza from favorites
 */
exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.deleteOne({
      user: req.user._id,
      pizzaId: req.params.pizzaId
    });
    res.json({ message: "Favorite removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
};
