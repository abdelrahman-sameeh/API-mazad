const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");

// @desc   add product to favorite
// @method  PUT
// @access  private
exports.addToFavorites = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { favorites: req.params.id },
    },
    { new: true }
  );

  res.status(200).json({ favorites: user.favorites });
});

// @desc   remove product to favorite
// @method  PUT
// @access  private
exports.deleteFromFavorites = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { favorites: req.params.id },
    },
    { new: true }
  );

  res.status(200).json({ favorites: user.favorites });
});

// @desc   get logged user favorites
// @method  GET
// @access  private
exports.getUserFavorites = expressAsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id, { favorites: true }).populate(
    "favorites"
  );
  res.status(200).json({ data: user.favorites });
});
