const { Router } = require("express");

const mealRouter = Router();
const mealController = require("../controllers/mealController")

mealRouter.get("/", (req, res) => {res.render("index")});
mealRouter.post("/search-meal", mealController.searchMeal);

module.exports = mealRouter;