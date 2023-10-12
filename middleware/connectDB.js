const { default: mongoose } = require("mongoose");
const ApiError = require("../utils/ApiError");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connect with database successfully");
  } catch (error) {
    console.log("Error connection in database");
    return new ApiError("database error connection", 500);
  }
};
