const { check } = require("express-validator");
const Product = require("../model/productModel");
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.checkProductIdValidator = [
  check("id")
    .notEmpty()
    .withMessage("product ID is required")
    .isMongoId()
    .withMessage("Enter a valid ID")
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) throw "no product match this id";
      return true;
    }),
  validatorMiddleware,
];
