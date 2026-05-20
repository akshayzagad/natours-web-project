// const Tour = require("./../models/tourModel");
const qs = require("qs");
const fs = require("fs");
const Tour = require("../../models/tourModel");

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
    fields: "name,price,ratingsAverage,summary,difficulty"
  };
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Build Query
    // 1 A}Filltering
    let queryObj;
    if (req.aliasParams) {
      queryObj = { ...req.aliasParams };
    } else {
      queryObj = qs.parse(req.query);
    }

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1 B}Advance Filltering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2}Sorting
    const sortVal = req.aliasParams?.sort || req.query.sort;
    if (sortVal) {
      const sortBy = sortVal.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //3} Fields
    const fieldsVal = req.aliasParams?.fields || req.query.fields;
    if (fieldsVal) {
      const fields = fieldsVal.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //3} Pagination
    const limitVal = req.aliasParams?.limit || req.query.limit;
    const pageVal = req.aliasParams?.page || req.query.page;
    const page = pageVal * 1 || 1;
    const limit = limitVal * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (pageVal) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new error("This page does not exit");
    }

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
    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message || error,
    });
  }
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "succses",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "succses",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(204).json({
      status: "succses",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
