const { default: mongoose } = require("mongoose");
const moongoose = require("mongoose");

const reviewSchema = new moongoose.Schema(
  {
    review: { type: String, require: [true, "Review cannot be empty!"] },
    rating: {
      type: Number,
      default: 1,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review mus belong to Tour"],
    },
    user: {
      type: moongoose.Schema.ObjectId,
      ref: "user",
      required: [true, "Review mus belong to User"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
