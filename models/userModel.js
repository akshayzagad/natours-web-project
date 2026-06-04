const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Please tell us your name']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate:[validator.isEmail,'Please provide your valid email']
  },

  photo: {
    type: String,
    // default: 'default.jpg'
  },

//   role: {
//     type: String,
//     enum: ['user', 'guide', 'lead-guide', 'admin'],
//     default: 'user'
//   },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This is only work on user.save and user.create
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
});

userSchema.pre('save',async function () {
  // Only run this function if password modified
  if(!this.isModified('password')) return ;
  //Hash the password with cast of 12
  this.password = await bcrypt.hash(this.password,12);
  //Delete passwordConform field
  this.passwordConfirm = undefined;  
})

const User = mongoose.model('User',userSchema);

module.exports = User;