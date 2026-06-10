const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("Unhandle Exception Shuting down");
  console.log(err.name,err.message);
    process.exit(1);
});

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log(con.connection);
  console.log("DB connection succesful");
});

// const Tour = mongoose.model("Tour", tourSchema);

// const testTour = new Tour({
//   name: "Zagade tour",
//   rating: 5,
//   price: 437,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log("Error is :", err);
//   });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandle Rejection Shuting down");
  server.close(() => {
    process.exit(1);
  });
});
