const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body);
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "succses",
    token,
    data: {
      User: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if here is login email and password
  if (!email || !password) {
    return next(new AppError("please provide email and password", 404));
  }

  //check is user is exists and email and password is correct
  const user = await User.findOne({ email }).select("+password");
  // console.log("Login attempt with email:", email);
  // console.log("User found in DB:", user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email and password", 404));
  }

  // If everything is ok then send json web token
  const token = signToken(user._id);
  // console.log("Token created for user ID:", user._id);

  res.status(200).json({
    status: "succses",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1) Getting a token and check it is there

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in! please log in", 401));
  }

  //2)Verification Token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log("decoded code", decoded);

  //3)Check if user still exists
  const currentUser = await User.findById(decoded.id);
  // console.log("Current User from DB:", currentUser);

  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exists",
        401,
      ),
    );
  }

  //4)Check if user changed password after the token was issued
  // console.log("passwordChangedAt field for user:", currentUser.passwordChangedAt);
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401),
    );
  }
  // Grant accses protected route
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    console.log("User role:", req.user.role, "Allowed roles:", roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }
    next();
  };
};

