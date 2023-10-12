const {
  updateOneItem,
  deleteOneItem,
  getOneItem,
  getListOfItems,
  createItem,
} = require("./handleFactory");

const Product = require("../model/productModel");
const expressAsyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");

// @desc    Create Product
// @route   POST  /api/v1/categories
// @access  Private
exports.createProduct = createItem(Product, "product");

// @desc    Get list of categories
// @route   GET  /api/v1/categories
// @access  Public
exports.getListOfProducts = getListOfItems(Product, "product");

// @desc    Get specific categories
// @route   GET  /api/v1/categories/:id
// @access  Public
exports.getSpecificProduct = getOneItem(Product, "product");

// @desc    Update specific categories
// @route   PUT  /api/v1/categories/:id
// @access  Private
exports.updateSpecificProduct = updateOneItem(Product, "product");

// @desc    Delete specific categories
// @route   DELETE  /api/v1/categories/:id
// @access  Private
exports.deleteProduct = deleteOneItem(Product, "product");

exports.setChatIdInBody = expressAsyncHandler(async (req, res, next) => {
  req.body.biggestValue = {};
  req.body.biggestValue.content = req.body.firstPrice;
  const chat = new Chat();
  await chat.save();
  req.body.chatId = chat._id;
  next();
});

exports.getProductInMazad = expressAsyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ chatId: req.params.chatId }).populate(
    { path: "biggestValue.sender", select: "name" }
  );
  res.status(200).json({ data: product });
});
