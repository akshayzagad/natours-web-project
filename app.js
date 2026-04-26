const { log } = require("console");
const express = require("express");
const fs = require("fs");

const app = express();

const tourRouter = require('./routes/toursRoutes')

app.use(express.json());

const getAllUsers = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const getUser = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const createUsers = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const updateUser = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

const deleteUsers = (req,res) => {
  res.status(500).json({
    status:"error",
    message:"this rote is not defined!"
  })
}

// Mouting the router

// const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/users', userRouter)

userRouter.route('/').get(getAllUsers).post(createUsers);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUsers);

module.exports = app;
