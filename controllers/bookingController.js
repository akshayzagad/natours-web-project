const axios = require("axios");
// const paystack = require("@paystack/paystack-sdk");
const crypto = require("crypto");
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

      // callback_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,

      callback_url: `${process.env.FRONTEND_URL}/tourDetail?alert=booking`,

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
  try {
    // Verify Paystack signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(400).send("Invalid signature");
    }

    // Parse event
    const event = JSON.parse(req.body.toString());

    // Create booking only after successful payment
    if (event.event === "charge.success") {
      const { tourId, userId } = event.data.metadata;

      const existingBooking = await Booking.findOne({
        tour: tourId,
        user: userId,
      });

      if (!existingBooking) {
        await Booking.create({
          tour: tourId,
          user: userId,
          price: event.data.amount / 100,
        });
      }
    }

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.error("Webhook Error:", err);

    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

console.log("webhookCheckout type:", typeof exports.webhookCheckout);
