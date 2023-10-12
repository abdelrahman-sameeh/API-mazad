const {
  updateOneItem,
  deleteOneItem,
  getOneItem,
  getListOfItems,
  createItem,
} = require("./handleFactory");

const Category = require("../model/categoryModel");

// @desc    Create category
// @route   POST  /api/v1/categories
// @access  Private
const createCategory = createItem(Category, "category");

// @desc    Get list of categories
// @route   GET  /api/v1/categories
// @access  Public
const getListOfCategories = getListOfItems(Category, "category");

// @desc    Get specific categories
// @route   GET  /api/v1/categories/:id
// @access  Public
const getSpecificCategory = getOneItem(Category, "category");

// @desc    Update specific categories
// @route   PUT  /api/v1/categories/:id
// @access  Private
const updateSpecificCategory = updateOneItem(Category, "category");

// @desc    Delete specific categories
// @route   DELETE  /api/v1/categories/:id
// @access  Private
const deleteCategory = deleteOneItem(Category, "category");

module.exports = {
  createCategory,
  getListOfCategories,
  getSpecificCategory,
  updateSpecificCategory,
  deleteCategory,
};
