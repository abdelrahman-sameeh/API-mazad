const express = require("express");
const { protect, allowTo } = require("../services/authService");
const { getCheckoutSession } = require("../services/orderService");
const router = express.Router();

router.get(
  "/checkout-session/:productId",
  protect,
  allowTo("user"),
  getCheckoutSession
);

module.exports = router;
