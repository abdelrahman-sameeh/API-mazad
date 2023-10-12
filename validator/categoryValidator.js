const { check } = require("express-validator");
const Category = require("../model/categoryModel");
const validatorMiddleware = require("../middleware/validatorMiddleware");

exports.createCategoryValidator = [
  check("title")
    .notEmpty()
    .withMessage("Category title is required")
    .isLength({ min: 2 })
    .withMessage("Too short category title ")
    .custom(async (title, { req }) => {
      title = title.trim();
      const category = await Category.findOne({ title });
      if (category) {
        throw "Category already exist";
      }
      return true;
    }),
  validatorMiddleware,
];
