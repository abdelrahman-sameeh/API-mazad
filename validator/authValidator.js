const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");

exports.registerValidator = [
  check("name")
    .notEmpty()
    .withMessage("username name required")
    .isLength({ min: 2 })
    .withMessage("username must be 2 character or more"),
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    // check if email is used or not
    .custom(async (value, { req }) => {
      const isUsed = await User.findOne({ email: value });
      if (isUsed) {
        throw new ApiError("this email already used", 400);
      }
      return true;
    }),
  check("role")
    .notEmpty()
    .withMessage("User role is required")
    .custom((value) => {
      const roles = ["user", "trader"];
      if (!roles.includes(value)) {
        throw new ApiError(
          `Role must be one of these roles [${roles.join(", ")}]`
        );
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Too short password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password confirmation is incorrect");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .notEmpty()
    .withMessage("email is required")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      req.user = user;
      if (!user) {
        throw new ApiError("email or password is incorrect", 401);
      }
      return true;
    }),
  check("password")
    .isLength({ min: 4 })
    .withMessage("password must be 4 character or more")
    .notEmpty()
    .withMessage("enter your password")
    .custom(async (value, { req }) => {
      const user = req.user;
      if (user) {
        const isCorrect = await bcrypt.compare(value, user.password);
        if (!isCorrect) {
          throw new ApiError("email or password is incorrect", 401);
        }
        return true;
      }
    }),
  validatorMiddleware,
];
