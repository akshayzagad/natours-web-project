const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getAllReviews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.setTourUserIds = (req, res, next) => {
    //Allow Nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  // console.log('BODY AFTER:', req.body);
  next();
};

exports.checkReviewExists = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({
    tour: req.params.tourId,
    user: req.user.id
  });

  if (review) {
    return next(
      new AppError(
        'You have already reviewed this tour',
        400
      )
    );
  }

  next();
});

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
