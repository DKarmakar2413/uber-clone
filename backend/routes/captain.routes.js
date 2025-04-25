const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const captainController = require("../controller/captain.controller")
const authMiddleware = require("../middlewares/auth.middleware")

router.post(
  "/register",
  [
    // Existing validations
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    
    // Vehicle validations
    body("vehicle.color")
      .notEmpty()
      .withMessage("Vehicle color is required"),
    body("vehicle.plateNumber")
      .notEmpty()
      .withMessage("Vehicle plate number is required"),
    body("vehicle.capacity")
      .isInt({ min: 1 })
      .withMessage("Vehicle capacity must be a positive number"),
    body("vehicle.vehicleType")
      .isIn(["car", "motorcycle", "auto"])
      .withMessage("Vehicle type must be either car, motorcycle, or auto"),

    // // Location validations
    // body("location.latitude")
    //   .isFloat({ min: -90, max: 90 })
    //   .withMessage("Invalid latitude value"),
    // body("location.longitude")
    //   .isFloat({ min: -180, max: 180 })
    //   .withMessage("Invalid longitude value"),

    // // Status validation (optional since it has a default value)
    // body("status")
    //   .optional()
    //   .isIn(["active", "inactive"])
    //   .withMessage("Status must be either active or inactive"),
  ],
  captainController.registerCaptain
)

module.exports = router