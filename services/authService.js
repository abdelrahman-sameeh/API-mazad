const expressAsyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/userModel");
const generateToken = require("../utils/generateToken");
const ApiError = require("../utils/ApiError");

// @desc    Signup
// @route   POST  /api/v1/auth/signup
// @access  Public
exports.register = expressAsyncHandler(async (req, res, next) => {
  // hash password
  const password = await bcrypt.hash(req.body.password, 12);

  // 1) create user
  const user = await User.create({
    name: req.body.name,
    password,
    email: req.body.email,
    role: req.body.role,
  });

  // 2) generate token
  const token = generateToken(user._id);

  res.status(201).json({
    data: user,
    token,
  });
});

// @desc    Login
// @route   GET  /api/v1/auth/login
// @access  Public
exports.login = expressAsyncHandler(async (req, res, next) => {
  // 1- check if email and password is correct (validation layer)
  // 2- get user
  const user = await User.findOne({ email: req.body.email });
  // 3- generate token
  const token = generateToken(user._id);

  // 4- send response
  req.user = user;

  res.status(200).json({
    data: user,
    token,
  });
});

// @desc make sure user is authenticated
exports.protect = expressAsyncHandler(async (req, res, next) => {
  // 1- check if token ex.authorization
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";
  if (!token) {
    return next(
      new ApiError(
        "you are not login, please login to get access this route.",
        401
      )
    );
  }

  // 2- verify token (no change happen | expired token)
  const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

  // 3- check if user exist
  const user = await User.findOne({ _id: decoded.userId });
  if (!user) {
    return next(new ApiError("the user belong to this token is't exist", 401));
  }

  // 4- check if user change his password after token created
  if (user.changedPasswordAt) {
    const changedPasswordAtTimestamp = parseInt(
      user.changedPasswordAt.getTime() / 1000
    );

    // password was changed
    if (changedPasswordAtTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "this user changed his password recently, please login again",
          401
        )
      );
    }
  }

  req.user = user;
  next();
});

// @desc   Authorization (user permission)
exports.allowTo = (...roles) =>
  expressAsyncHandler(async (req, res, next) => {
    // 2- access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("this user have no permission to access this route", 403)
      );
    }
    next();
  });




exports.getLoggerUser = expressAsyncHandler(async (req, res, next) => {
  res.json({
    user: req.user,
  });
});
