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

class APIFeatures {
  constructor(query, queryString, aliasParams) {
    this.query = query;
    this.queryString = queryString;
    this.aliasParams = aliasParams;
  }
  //Build Query
  filter() {
    // 1 A}Filltering
    let queryObj;
    if (this.aliasParams) {
      queryObj = { ...this.aliasParams };
    } else {
      queryObj = qs.parse(this.queryString);
    }

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1 B}Advance Filltering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2}Sorting
    const sortVal = this.aliasParams?.sort || this.queryString.sort;
    if (sortVal) {
      const sortBy = sortVal.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    //3} Fields
    const fieldsVal = this.aliasParams?.fields || this.queryString.fields;
    if (fieldsVal) {
      const fields = fieldsVal.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  pagination() {
    //3} Pagination
    const limitVal = this.aliasParams?.limit || this.queryString.limit;
    const pageVal = this.aliasParams?.page || this.queryString.page;
    const page = pageVal * 1 || 1;
    const limit = limitVal * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (pageVal) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new error("This page does not exit");
    // }
    return this;
  }
}

exports.aliasTopTour = (req, res, next) => {
  req.aliasParams = {
    limit: "5",
    sort: "ratingsAverage,price",
    fields: "name,price,ratingsAverage,summary,difficulty",
  };
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
