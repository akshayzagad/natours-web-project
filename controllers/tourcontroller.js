// const Tour = require("./../models/tourModel");
const fs = require("fs");

const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require('./handlerFactory')
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`),
// );

// exports.checkId = (req,res,next,val) =>{
//   console.log(`Tour id is:${val}`);

//    if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: "fail",
//       message: "Invalid id",
//     });
//   }
//   next();
// }

// exports.checkBody = (req,res,next)=>{
//   if (!req.body.name||!req.body.price) {
//     return res.status(400).json({
//       status:"fail",
//       message:"missing name and price"
//     })
//   }
//   next();
// }

exports.aliasTopTour = (req, res, next) => {
  req.aliasParams = {
    limit: "5",
    sort: "ratingsAverage,price",
    fields: "name,price,ratingsAverage,summary,difficulty",
  };
  next();
};

exports.getAllTours = catchAsync(async (req, res,next) => {
  /**
     * {
        difficulty: 'easy',
        page: '2',
        sort: '1',
        limit: '1',
        'duration[gte]': '5'
      } { difficulty: 'easy', 'duration[gte]': '5' }
     */

  //Excecute Query

  const features = new APIFeatures(Tour.find(), req.query, req.aliasParams)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res,next) => {
  // console.log(req.params);

  const tour = await Tour.findById(req.params.id).populate('reviews');
  // .populate({path:'guides',select:'-__v -passwordChangedAt'})
  if (!tour) {
    return next(new AppError('No tour found with that ID',404))
  }
  res.status(200).json({
    status: "succses",
    data: {
      tour,
    },
  });
});

// exports.createTour = catchAsync(async (req, res,next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: { tour: newTour },
//   });
// });

exports.createTour = factory.createOne(Tour)

exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour)

exports.getToursStats = catchAsync(async (req, res,next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgrating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //    $match:{_id:{$ne:'EASY'}}
    // }
  ]);
  res.status(200).json({
    status: "succses",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: {
          $push: "$name",
        },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numTourStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: "succses",
    data: {
      plan,
    },
  });
});