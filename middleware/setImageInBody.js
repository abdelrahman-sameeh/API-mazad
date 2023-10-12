exports.setImageInBody = (req, res, next) => {
  if (req.file) req.body.image = req.file.filename;
  next();
};