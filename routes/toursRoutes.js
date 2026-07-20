const tourController = require("../controllers/tourcontroller");
const authcontroller = require("../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require("../routes/reviewRoutes");
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

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getToursStats);

router
  .route("/monthly-plan/:year")
  .get(
    authcontroller.protect,
    authcontroller.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan,
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getTourWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authcontroller.protect,
    authcontroller.restrictTo("admin", "lead-guide"),
    tourController.createTour,
  );

router
  .route("/:id")
  .get(authcontroller.isLoggedIn,tourController.getTour)
  .patch(
    authcontroller.protect,
    authcontroller.restrictTo("admin", "lead-guide"),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authcontroller.protect,
    authcontroller.restrictTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

module.exports = router;
