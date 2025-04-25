const captainModel = require("../models/captain.model")
const captainService = require("../services/captain.service")
const { validationResult } = require("express-validator")

module.exports.registerCaptain = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const { fullname, email, password, vehicle } = req.body
  const { firstname, lastname } = fullname
  const { vehicleType, color, plateNumber, capacity } = vehicle

  const isEmailExists = await captainModel.findOne({ email })
  if (isEmailExists) {
    return res.status(409).json({
      status: "fail",
      message: "Captain with this email already exists",
    })
  }
  const hashedPassword = await captainModel.hashPassword(password)
  const captain = await captainService.createCaptain({
    firstname,
    lastname,
    email,
    password: hashedPassword,
    vehicleType,
    color,
    plateNumber,
    capacity,
  })
  console.log("Saving captain to MongoDB:", captain)

  try {
    await captain.save()
  } catch (err) {
    console.error("❌ Error saving captain:", err)
  }

  const token = await captain.generateAuthToken()

  res.status(201).json({
    status: "success",
    data: {
      captain,token
    },
  })
}
