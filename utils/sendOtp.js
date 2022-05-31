const otpGenerator = require("otp-generator");
const Otp = require("../models/otp");
const sendEmail = require("./mailer");

module.exports.sendOtp = async (email) => {
  try {
    const OTP = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    Otp.create({
      otp: OTP,
      email: email,
    }).then(async (result) => {
      await sendEmail(email, "Validation otp", OTP);
    }).catch((err) => {
      console.log(err);
    })

    // await new Otp({
    //   otp: OTP,
    //   email: email,
    // }).save().then(async (result) => {
    //   await sendEmail(email, "Validation otp", OTP);
    // }).catch((err) => {
    //   console.log(err);
    // })
  } catch (error) {
    throw new Error(error);

  }

}