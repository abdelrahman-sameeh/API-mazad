const { check } = require("express-validator");
const validatorMiddleware = require("../middleware/validatorMiddleware");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 2 })
    .withMessage("Too short title"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required"),
  check("category")
    .isMongoId()
    .withMessage("Enter a valid category ID")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw "Product must be have a category";
      }
      return true;
    }),
  check("firstPrice").notEmpty().withMessage("first price is required"),
  check("leastIncreasePrice")
    .notEmpty()
    .withMessage("least increase price is required"),
  check("startTime")
    .notEmpty()
    .withMessage("start time is required")
    .custom((value) => {
      const date = new Date(value).getTime();
      const dateNow = Date.now();
      if (date < dateNow) {
        throw "Time must be greater than date now";
      }
      return true;
    }),
  check("endTime")
    .notEmpty()
    .withMessage("End time is required")
    .custom((value, { req }) => {
      const startTime = new Date(req.body.startTime).getTime();
      const endTime = new Date(value).getTime();
      if (endTime < startTime) {
        throw "End time must be greater than start time";
      }
      return true;
    }),
  check("phoneNumber").notEmpty().withMessage("phone number is required"),
  validatorMiddleware,
];

exports.updateSpecificProductValidator = [
  check("title")
    .optional()
    .notEmpty()
    .withMessage("product title is required")
    .isLength({ min: 2 })
    .withMessage("Too short title"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Product description is required"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Enter a valid category ID")
    .custom(async (value) => {
      const category = await Category.findById(value);
      if (!category) {
        throw "Product must be have a category";
      }
      return true;
    }),
  check("firstPrice")
    .optional()
    .notEmpty()
    .withMessage("first price is required"),
  check("leastIncreasePrice")
    .optional()
    .notEmpty()
    .withMessage("least increase price is required"),
  check("startTime")
    .optional()
    .notEmpty()
    .withMessage("start time is required")
    .custom((value) => {
      const date = new Date(value).getTime();
      const dateNow = Date.now();
      if (date < dateNow) {
        throw "Time must be greater than date now";
      }
      return true;
    }),
  check("endTime")
    .optional()
    .notEmpty()
    .withMessage("End time is required")
    .custom((value, { req }) => {
      const startTime = new Date(req.body.startTime).getTime();
      const endTime = new Date(value).getTime();
      if (endTime < startTime) {
        throw "End time must be greater than start time";
      }
      return true;
    }),
  check("phoneNumber")
    .optional()
    .notEmpty()
    .withMessage("phone number is required"),
  validatorMiddleware,
];

exports.checkProductId = [
  check("id")
    .notEmpty()
    .withMessage("ID is required")
    .isMongoId()
    .withMessage("Please enter a valid ID")
    .custom(async (value) => {
      const product = await Product.findById(value);
      if (!product) {
        throw "No product match this ID";
      }
      return true;
    }),
  validatorMiddleware,
];
