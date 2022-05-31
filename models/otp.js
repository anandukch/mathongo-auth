const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})
const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;