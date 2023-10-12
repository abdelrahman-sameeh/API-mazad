const multer = require("multer");

exports.uploadSingleImage = (fieldName, dist) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/${dist}`);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${dist}-${uniqueSuffix}-${file.originalname}`);
    },
  });
  const upload = multer({ storage: storage });
  return upload.single(fieldName);
};
