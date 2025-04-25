const captainSchema= require("../models/captain.model");

module.exports.createCaptain = async ({firstname, lastname, email, password,color,plateNumber,capacity,vehicleType}) => {
  if (!firstname || !email || !password || !vehicleType || !color || !plateNumber || !capacity) {
    throw new Error('All fields are required');
  }
  const captain = captainSchema({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vehicle: {
      vehicleType,
      color,
      plateNumber,
      capacity
    }
  });
  return captain;
}