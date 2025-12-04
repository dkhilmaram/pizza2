const nodemailer = require("nodemailer");
const Pizza = require("../models/menuitem");
const { sendNewMenuEmailToAllUsers } = require("../config/menunotification");
const User = require("../models/User"); // make sure you have a User model

// =========================
// PUBLIC CONTROLLERS
// =========================

// Get all pizzas for public (only available)
exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({ available: true });
    res.json(pizzas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single pizza by ID (only if available)
exports.getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza || !pizza.available)
      return res.status(404).json({ message: "Pizza not found" });

    res.json(pizza);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// ADMIN CONTROLLERS
// =========================

// Get all pizzas for admin (ignore availability)
exports.getAllPizzasAdmin = async (req, res) => {
  try {
    const pizzas = await Pizza.find(); // no filter
    res.json(pizzas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new pizza
exports.createPizza = async (req, res) => {
  try {
    const { name, ingredients, price, img } = req.body;

    if (!name || !ingredients || !price || !img)
      return res.status(400).json({ message: "All fields are required" });

    const pizza = new Pizza({ name, ingredients, price, img });
    const savedPizza = await pizza.save();

    // Fetch all users
    const users = await User.find({});

    // Send email notification
    await sendNewMenuEmailToAllUsers(users, savedPizza);

    res.status(201).json(savedPizza);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update pizza by ID
exports.updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });

    const { name, ingredients, price, img, available } = req.body;
    let changed = false;

    if (name !== undefined && name !== pizza.name) { pizza.name = name; changed = true; }
    if (ingredients !== undefined && ingredients !== pizza.ingredients) { pizza.ingredients = ingredients; changed = true; }
    if (price !== undefined && price !== pizza.price) { pizza.price = price; changed = true; }
    if (img !== undefined && img !== pizza.img) { pizza.img = img; changed = true; }
    if (available !== undefined && available !== pizza.available) { pizza.available = available; changed = true; }

    const updatedPizza = await pizza.save();

    // Send notification only if something changed
    if (changed) {
      const users = await User.find({});
      await sendNewMenuEmailToAllUsers(users, updatedPizza);
    }

    res.json(updatedPizza);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete pizza (soft delete)
exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: "Pizza not found" });

    pizza.available = false;
    await pizza.save();

    res.json({ message: "Pizza removed from menu", pizza });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
