const express = require("express");
const { protect, allowTo } = require("../services/authService");
const { getCheckoutSession, getLoggedUserOrders, setFilterObj } = require("../services/orderService");
const router = express.Router();

router.get('/orders', protect, allowTo('user'), setFilterObj, getLoggedUserOrders)

router.get(
  "/checkout-session/:productId",
  protect,
  allowTo("user"),
  getCheckoutSession
);

module.exports = router;
