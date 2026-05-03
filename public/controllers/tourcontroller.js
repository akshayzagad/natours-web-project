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

exports.getAllTours = async (req, res) => {
  try {
    //Build Query
    // 1 A}Filltering

    const queryObj = qs.parse(req.query);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el=>delete queryObj[el]);
    // console.log(req.query,queryObj);
    
    // 1 B}Advance Filltering
    /**
     * here we convert gte|gt|lte|lt { difficulty: 'easy', 'duration[gte]': '5' } 
     * to { difficulty: 'easy', duration: { $gte: 5 } }
     */
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);
    // console.log(JSON.parse(queryStr));
    
    let query =  Tour.find(JSON.parse(queryStr));

    // 2}Sorting
    if(req.query.sort){
      // console.log(req.query.sort);
      
      let sortBy = req.query.sort.split(',').join(' ');
      console.log(sortBy);
      
      query = query.sort(sortBy);
    }else{
      sortBy = req.sort.query('-createdAt')
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
    const tours =await query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
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
