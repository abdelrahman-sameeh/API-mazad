exports.setUserInBody = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};
