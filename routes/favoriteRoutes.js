const express = require("express");
const { addToFavorites, deleteFromFavorites } = require("../services/favoriteService");
const { checkProductIdValidator } = require("../validator/favoriteValidator");
const { protect, allowTo } = require("../services/authService");
const router = express.Router();

router.put(
  "/addToFavorites/:id",
  protect,
  allowTo("user"),
  checkProductIdValidator,
  addToFavorites
);

router.put(
  "/deleteFromFavorites/:id",
  protect,
  allowTo("user"),
  checkProductIdValidator,
  deleteFromFavorites
);

module.exports = router;
