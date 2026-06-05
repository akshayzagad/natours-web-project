const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

const signToken = id => {
    return  jwt.sign({id },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

exports.signUp =catchAsync(async(req,res,next)=>{
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });
    const token = signToken(newUser._id)
    res.status(201).json({
        status:'succses',
        token,
        data:{
          User: newUser
        }
    })
});

exports.login =catchAsync(async(req,res,next) =>{
    const {email,password} = req.body;
    
    //Check if here is login email and password
    if (!email || !password) {
       return next(new AppError('please provide email and password',404))
    }

    //check is user is exists and email and password is correct
    const user =await User.findOne({email}).select('+password');
    console.log(user);
    if (!user || !(await user.correctPassword(password,user.password))) {
        return next(new AppError('Incorrect email and password',404));
    }
    
    // If everything is ok then send json web token
    const token = signToken(user._id);

    res.status(200).json({
        status:'succses',
        token
    })   
})