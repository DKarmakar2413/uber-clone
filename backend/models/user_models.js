const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minlength:[ 3, "First name must be at least 3 characters"],
      },
      lastname: {
        type: String,
        minlength:[ 3, "Last name must be at least 3 characters"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength:[ 5, "Email must be at least 3 characters"],
    },
    password: {
      type: String,
      required: true,
      select:false
    },
    socketId: {
      type: String,
    },
    
  },
)

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })
  return token;
}

// Fix: assign comparePassword as an instance method rather than as a property of userSchema.
userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}

userSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

const userModel = mongoose.model('User', userSchema)

module.exports = userModel