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
  try {
    console.log("================================");
    console.log("WEBHOOK HIT");
    console.log(new Date());
    console.log("================================");

    // Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(req.body)
      .digest("hex");

    console.log("Signature received:", req.headers["x-paystack-signature"]);
    console.log("Signature generated:", hash);

    if (hash !== req.headers["x-paystack-signature"]) {
      console.log("❌ Invalid signature");
      return res.status(400).send("Invalid signature");
    }

    console.log("✅ Signature verified");

    // Parse event
    const event = JSON.parse(req.body.toString());

    console.log("Event type:", event.event);
    console.log("Metadata:", event.data.metadata);

    if (event.event === "charge.success") {
      const metadata = event.data.metadata;

      console.log("Searching for existing booking...");

      const existingBooking = await Booking.findOne({
        tour: metadata.tourId,
        user: metadata.userId,
      });

      console.log("Existing booking:", existingBooking);

      if (!existingBooking) {
        console.log("Creating new booking...");

        const booking = await Booking.create({
          tour: metadata.tourId,
          user: metadata.userId,
          price: event.data.amount / 100,
        });

        console.log("✅ Booking created");
        console.log(booking);
      } else {
        console.log("⚠️ Booking already exists");
      }
    }

    console.log("Webhook processing completed");

    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.error("❌ WEBHOOK ERROR");
    console.error(err);

    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

console.log("webhookCheckout type:", typeof exports.webhookCheckout);
