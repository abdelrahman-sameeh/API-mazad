const express = require("express");
const {
  getListOfCategories,
  getSpecificCategory,
  deleteCategory,
  updateSpecificCategory,
  createCategory,
} = require("../services/categoryService");
const router = express.Router();
const AuthService = require("../services/authService");
const { uploadSingleImage } = require("../utils/uploadSingleImage");
const { createCategoryValidator } = require("../validator/categoryValidator");
const { setImageInBody } = require("../middleware/setImageInBody");

router
  .route("/categories")
  .post(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image", "category"),
    setImageInBody,
    createCategoryValidator,
    createCategory
  )
  .get(getListOfCategories);

router
  .route("/categories/:id")
  .get(getSpecificCategory)
  .delete(AuthService.protect, AuthService.allowTo("admin"), deleteCategory)
  .put(
    AuthService.protect,
    AuthService.allowTo("admin"),
    updateSpecificCategory
  );

module.exports = router;
