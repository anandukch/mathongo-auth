const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  otp: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
})
const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;