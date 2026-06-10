const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model => catchAsync(async (req, res,next) => {
  const doc = await Model.findByIdAndDelete(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No document found with that ID',404))
  }
  res.status(204).json({
    status: "succses",
    data: null,
  });
}); 

exports.updateOne = model => catchAsync(async (req, res,next) => {
  const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!doc) {
    return next(new AppError('No document found with that ID',404))
  }
  res.status(200).json({
    status: "succses",
    data: {
     data: doc,
    },
  });
});

exports.createOne = model =>catchAsync(async (req, res,next) => {
  const doc = await model.create(req.body);
  if (!doc) {
    return next(new AppError('No document found with that ID',404))
  }  
  res.status(201).json({
    status: "success",
    data: doc ,
  });
});