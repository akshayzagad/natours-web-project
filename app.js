const express = require("express");

const AppError = require('./utils/appError')
const tourRouter = require("./routes/toursRoutes");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController")
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this rote is not defined!",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this rote is not defined!",
  });
};

const createUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this rote is not defined!",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this rote is not defined!",
  });
};

const deleteUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this rote is not defined!",
  });
};

// Mouting the router

// const tourRouter = express.Router();
const userRouter = express.Router();

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

userRouter.route("/").get(getAllUsers).post(createUsers);

userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUsers);

app.all("/*splat", (req, res, next) => {
  /**
   * Below is three stages to send erroe to app
   */
  //1}sending traditional response
  // res.status(404).json({
  //   status: "failed",
  //   message: `can't find ${req.originalUrl} on this server!`,
  // });
  //2}calling error object and define status and status code
  // const err = new Error(`can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  //3}creating a custom class to handle error
  next(new AppError(`can't find ${req.originalUrl} on this server!`,404));
});

app.use(globalErrorHandler);

module.exports = app;
