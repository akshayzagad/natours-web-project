const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize")
const xss = require('xss-clean');
const sanitizeHtml = require('sanitize-html');
const hpp = require('hpp');

const AppError = require("./utils/appError");
const tourRouter = require("./routes/toursRoutes");
const userRouter = require("./routes/usersRoutes");

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

// Data santization against noSQL query injection
// app.use(mongoSanitize());
// MongoDB NoSQL Injection Protection
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== "object") return;

    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
});

//Data santization against cross side scripting attack
// app.use(xss());
// Data sanitization against XSS
app.use((req, res, next) => {
  const clean = (obj) => {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      } else if (typeof obj[key] === 'object') {
        clean(obj[key]);
      }
    }
  };

  clean(req.body);
  clean(req.query);

  next();
});

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

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
