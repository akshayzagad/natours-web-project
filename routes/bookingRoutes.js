
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");
const express = require('express');
const router = express.Router();
console.log('bookingController loaded');
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router.get('/my-tours',authController.isLoggedIn,bookingController.getMyBookedTours);
module.exports = router;
