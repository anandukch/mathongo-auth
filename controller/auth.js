const Joi = require("joi");
const Otp = require("../models/otp");
const { User } = require("../models/user");
const sendEmail = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
module.exports.login = async (req, res) => {
  try {
    const schema = Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      res.status(400).json({
        message: result.error.details[0].message,
      });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }
    if (!user.isVerified) {
      res.status(400).json({
        message: "Please verify your email",
      });
    }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
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
    let newUser = new User(req.body);
    const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    await new Otp({
      otp: OTP,
      email: req.body.email,
    }).save();


    await sendEmail(newUser.email, "Validation otp", OTP);
    await newUser.save();

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

module.exports.validateOTP = async (req, res) => {
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


  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });

  }

}