const tourController = require("../controllers/tourcontroller");
const authcontroller = require("../controllers/authController")
// Middleware
const express = require("express");

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getToursStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authcontroller.protect,tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(authcontroller.protect, authcontroller.restrictTo('admin','lead-guide'), tourController.deleteTour);

module.exports = router;
