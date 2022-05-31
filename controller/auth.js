const Joi = require("joi");
const Otp = require("../models/otp");
const { User } = require("../models/user");
const sendEmail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendOtp } = require("../utils/sendOtp");
module.exports.login = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message,
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }
    if (!user.isVerified) {
      await sendOtp(user.email);
      return res.status(400).json({
        message: `Otp has benn send to ${user.email} Please verify`,
      });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({
      message: "success",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });

  }
}

module.exports.signup = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (await User.findOne({ email: req.body.email })) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    // await sendEmail(newUser.email, "Validation otp", OTP);
    await sendOtp(req.body.email);


    if (result.error) {
      res.status(400).json({
        message: result.error.details[0].message,
      });
    } else {
      res.status(200).json({
        message: "success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });

  }

}

module.exports.verifyEmail= async (req, res) => {
  try {

    const schema = Joi.object().keys({
      otp: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      return res.status(400).json({
        message: result.error.details[0].message,
      });
    }
    const otp = await Otp.findOne({ otp: req.body.otp });
    if (!otp) {
      return res.status(400).json({
        message: "Invalid otp",
      });
    }
    const user = await User.findOne({ email: otp.email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid otp",
      });
    }
    await otp.delete();
    await User.findOneAndUpdate({ email: user.email }, { isVerified: true });
    return res.status(200).json({
      message: "user verfied successfully",
    });


  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });

  }

}