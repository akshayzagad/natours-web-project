const axios = require('axios');
const paystack = require('@paystack/paystack-sdk');

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel')
// const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');


exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Initialize Paystack transaction
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    {
      email: req.user.email,

      // Paystack expects smallest currency unit
      amount: tour.price * 100,

      callback_url: `${req.protocol}://${req.get(
        'host'
      )}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,

      metadata: {
        tourId: req.params.tourId,
        userId: req.user.id,
        tourName: tour.name
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  res.status(200).json({
    status: 'success',
    session: response.data.data
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.webhookCheckout = async (req, res) => {
  console.log('Webhook hit!');

  console.log(req.body);
  console.log(event);
  res.status(200).json({
    status: 'success'
  });
};