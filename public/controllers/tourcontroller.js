// const Tour = require("./../models/tourModel");
const qs = require("qs");
const fs = require("fs");
const tour = require('../../models/tourModel')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../../dev-data/data/tours-simple.json`),
// );

exports.checkId = (req,res,next,val) =>{
  console.log(`Tour id is:${val}`);
  
   if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid id",
    });
  }
  next();
}

exports.checkBody = (req,res,next)=>{
  if (!req.body.name||!req.body.price) {
    return res.status(400).json({
      status:"fail",
      message:"missing name and price"
    })
  }
  next();
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "succses",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "succses",
    results: tours.length,
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;

  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    },
  );
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "succses",
    data: {
      tour: "<Updated tour here>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "succses",
    data: null,
  });
};
