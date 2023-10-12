const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const { setImageInBody } = require("../middleware/setImageInBody");
const { setUserInBody } = require("../middleware/setUserInBody");

const {
  createProduct,
  getListOfProducts,
  getSpecificProduct,
  updateSpecificProduct,
  deleteProduct,
  setChatIdInBody,
  getProductInMazad,
} = require("../services/productService");
const { uploadSingleImage } = require("../utils/uploadSingleImage");
const {
  createProductValidator,
  updateSpecificProductValidator,
  checkProductId,
} = require("../validator/productValidator");

router
  .route("/product")
  .post(
    AuthService.protect,
    AuthService.allowTo("trader"),
    uploadSingleImage("image", "products"),
    setImageInBody,
    setUserInBody,
    createProductValidator,
    setChatIdInBody,
    createProduct
  )
  .get(getListOfProducts);

router
  .route("/product/:id")
  .get(checkProductId, getSpecificProduct)
  .put(
    AuthService.protect,
    AuthService.allowTo("trader"),
    uploadSingleImage("image", "products"),
    setImageInBody,
    checkProductId,
    setUserInBody,
    updateSpecificProductValidator,
    updateSpecificProduct
  )
  .delete(
    AuthService.protect,
    AuthService.allowTo("trader"),
    checkProductId,
    deleteProduct
  );

router.get("/mazadProduct/:chatId", getProductInMazad);

module.exports = router;
