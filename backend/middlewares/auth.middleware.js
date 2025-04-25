const userModel = require("../models/user_models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.authUser = async (req, res, next) => {
  // const token = req.cookies.token|| req.headers.authorization.split(" ")[1]
  console.log("Cookies:", req.cookies)
  console.log("Headers:", req.headers)
  const token =
    req.cookies?.token || // from cookies
    (req.headers.authorization && req.headers.authorization.split(" ")[1]) // from Bearer header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const ifBlacklisted = await userModel.findOne({ token });
  if (ifBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await userModel.findById(decoded._id)

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  console.log("Cookies:", req.cookies)
  console.log("Headers:", req.headers)
}
