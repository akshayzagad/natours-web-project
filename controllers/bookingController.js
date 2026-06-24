const axios = require("axios");
const paystack = require("@paystack/paystack-sdk");
const crypto = require('crypto');
const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");
// const Booking = require('../models/bookingModel');
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Initialize Paystack transaction
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: req.user.email,

      // Paystack expects smallest currency unit
      amount: tour.price * 100,

      callback_url: `${req.protocol}://${req.get("host")}/my-tours`,

      metadata: {
        tourId: tour.id,
        userId: req.user.id,
        tourName: tour.name,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  res.status(200).json({
    status: "success",
    session: response.data.data,
  });
});

exports.webhookCheckout = async (req, res) => {
  console.log('Webhook hit!');

  // 1. Verify Paystack Signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(req.body)
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  // 2. Parse Event
  const event = JSON.parse(req.body.toString());

  console.log(event.data.metadata);

  // 3. Process Successful Payment
  if (event.event === 'charge.success') {
    const metadata = event.data.metadata;

    const existingBooking = await Booking.findOne({
      tour: metadata.tourId,
      user: metadata.userId
    });

    if (!existingBooking) {
      await Booking.create({
        tour: metadata.tourId,
        user: metadata.userId,
        price: event.data.amount / 100
      });

      console.log('Booking created');
    }
  }

  res.status(200).json({
    status: 'success'
  });
};
