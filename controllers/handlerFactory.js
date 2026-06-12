const { model } = require("mongoose");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(204).json({
      status: "succses",
      data: null,
    });
  });

exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "succses",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (model, populateOption) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.params);
    let query = model.findById(req.params.id);
    if (populateOption) {
      query = query.populate(populateOption);
    }
    const doc = await query;
    // .populate({path:'guides',select:'-__v -passwordChangedAt'})
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(200).json({
      status: "succses",
      data: {
        doc,
      },
    });
  });

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    /**
     * To allow nested GET reviews on tour
     */
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(
      model.find(filter),
      req.query,
      req.aliasParams,
    )
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const doc = await features.query.explain();
    const doc = await features.query;
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
