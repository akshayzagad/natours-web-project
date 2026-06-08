const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide your valid email"],
  },

  photo: {
    type: String,
    // default: 'default.jpg'
  },

  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This is only work on user.save and user.create
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function () {
  // Only run this function if password modified
  if (!this.isModified("password")) return;

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  // if (!this.isNew) {
  //   this.passwordChangedAt = Date.now() - 1000;
  // }
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) {
    return ;
  }

  this.passwordChangedAt = Date.now() - 1000;
  
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime
        ? this.passwordChangedAt.getTime()
        : new Date(this.passwordChangedAt).getTime()) / 1000,
      10,
    );
    console.log(
      "passwordChangedAt:",
      changedTimestamp,
      "JWT iat:",
      JWTTimestamp,
    );
    return JWTTimestamp < changedTimestamp;
  }
  // Palse means not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  //1) Here we create a temparary token for a forgot password 
  const resetToken = crypto.randomBytes(32).toString("hex");
  // 2) here we incrypted it and send to the database 
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
