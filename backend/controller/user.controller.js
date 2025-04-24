const userModel = require('../models/user_models')
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res,next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname;
    const hashedPassword = await userModel.hashPassword(password);
    const user = await userService.createUser({
        firstname,
        lastname,
        email,
        password: hashedPassword,
    });
    console.log("Saving user to MongoDB:", user)

    try {
      await user.save()
    } catch (err) {
      console.error("❌ Error saving user:", err)
    }


    const token = await user.generateAuthToken();

    res.status(201).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                token,
            },
        },
    });
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password',
        });
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
        return res.status(401).json({
            status: 'fail',
            message: 'Invalid email or password',
        });
    }

    const token = await user.generateAuthToken();

    res.status(200).json({
        status: 'success',
        data: {
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                token,
            },
        },
    });
}
