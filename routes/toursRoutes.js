const tourController = require("../controllers/tourcontroller");
const authcontroller = require("../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require('../routes/reviewRoutes');
// Middleware
const express = require("express");

const router = express.Router();

// router.param('id', tourController.checkId);
//POST/tour/:tourid/reviews
//Get/tour/:tourid/reviews
//POST/tour/:tourid/reviews/id

// router
//   .route("/:tourId/reviews")
//   .post(
//     authcontroller.protect,
//     authcontroller.restrictTo("user"),
//     reviewController.createReview,
//   );

router.use('/:tourId/reviews',reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getToursStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authcontroller.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authcontroller.protect,
    authcontroller.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );



module.exports = router;
