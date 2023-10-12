const express = require("express");
const {
  login,
  register,
  getLoggerUser,
  protect,
} = require("../services/authService");
const {
  registerValidator,
  loginValidator,
} = require("../validator/authValidator");
const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/getLoggedUser", protect, getLoggerUser);

module.exports = router;
