const express = require("express");
const router = express.Router();
const {
  getAllPizzas,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza,
} = require("../controllers/menuController");

// =========================
// PUBLIC ROUTES
// =========================
router.get("/", getAllPizzas);          // GET all available pizzas
router.get("/:id", getPizzaById);       // GET single pizza by ID

// =========================
// ADMIN ROUTES (DEV MODE - no auth)
// =========================
router.post("/", createPizza);          // Add pizza
router.put("/:id", updatePizza);        // Update pizza
router.delete("/:id", deletePizza);     // Soft delete pizza

module.exports = router;
