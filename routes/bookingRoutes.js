
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");
const express = require('express');
const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

module.exports = router;
