const fs = require("fs");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
);

/** Routes Handlers for Users */

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(201).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUsers = (req, res) => {
  const newId = users[users.length - 1].id + 1;
  console.log(users.length);

  const newUser = Object.assign({ id: newId }, req.body);
  users.push(newUser);
  fs.writeFile(
    `${__dirname}/../dev-data/data/users.json`,
    JSON.stringify(users),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          user: newUser,
        },
      });
    },
  );
};
