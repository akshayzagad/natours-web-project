const fs = require("fs");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory')

const filterObj = (obj, ...allowFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
// );

/** Routes Handlers for Users */

exports.getMe = (req,res,next) =>{
  req.params.id = req.user.id;
  next()
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update please use /update my password",
        400,
      ),
    );
  }
  //Filtered unwanted fields which is not allows to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  //Update user documents
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "succses",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id,{active:false});
  res.status(204).json({
    status:'succses',
    data:null
  })
})

exports.getAllUsers = factory.getAll(User);

exports.getUser = factory.getOne(User);

exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
