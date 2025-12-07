const Pizza = require("../models/menuitem");

const defaultPizzas = [
  { name: "Margherita", price: 12.0, ingredients: "Tomate, Mozzarella, Basilic", img: "...", available: true },
  { name: "Pepperoni", price: 14.5, ingredients: "Pepperoni, Mozzarella, Sauce tomate", img: "...", available: true },
  // add `available: true` to all...
];

async function seedPizzas() {
  const count = await Pizza.countDocuments();
  if (count === 0) {
    await Pizza.insertMany(defaultPizzas);
    console.log("🍕 Default pizzas inserted in DB!");
  } else {
    console.log("🍕 Pizzas already exist, skipping seed.");
  }
}

module.exports = seedPizzas;
