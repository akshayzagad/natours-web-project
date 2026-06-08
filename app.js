const express = require("express");

const AppError = require("./utils/appError");
const tourRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/usersRoutes");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const globalErrorHandler = require("./controllers/errorController");

const app = express();
//Security http headers
app.use(helmet());

// 1) Global Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit request from api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many request from this Ip , please try again in an hour!",
});

app.use("/api", limiter);

// Body parser,reading data from body into req.body
app.use(express.json({limit:'10kb'}));

// Serving static file page
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// Mouting the router

// const tourRouter = express.Router();
// const userRouter = express.Router();

app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

// userRouter.route("/").get(getAllUsers).post(createUsers);

// userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUsers);

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
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
