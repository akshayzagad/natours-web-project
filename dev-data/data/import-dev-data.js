/* eslint-disable import/order */
/* eslint-disable no-undef */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("./../../models/tourModel");
const User = require("./../../models/userModel");
const Review = require("./../../models/reviewModel");
const { log } = require("console");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then((con) => {
    console.log(con.connection);
    console.log("DB connection succesful");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

//Read json file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, "utf-8"));


//Import DATA into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users,{validateBeforeSave:false});
    await Review.create(reviews);
    console.log("Data Created");
  } catch (err) {
    console.log(err);
  }
};

// Delete DATA into DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("Data Deleted");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData().then(() => process.exit());
} else if (process.argv[2] === "--delete") {
  deleteData().then(() => process.exit());
}

console.log(process.argv);
