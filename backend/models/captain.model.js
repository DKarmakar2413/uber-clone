const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: [5, "Email must be at least 3 characters"],
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  vehicle: {
    color: {
      type: String,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    vehicleType: {
      type: String,
      enum: ["car", "motorcycle","auto"],
      required: true,
    },
  },
  location: {
    latitude: {
      type: Number,

    },
    longitude: {
      type: Number,

    },
  },
})

captainSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' })
  return token;
}
captainSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password)
  return isMatch
}
captainSchema.statics.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

module.exports = mongoose.model('Captain', captainSchema)