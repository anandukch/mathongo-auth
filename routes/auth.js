const { login, signup, validateOTP } = require('../controller/auth');

const router=require('express').Router();

router.post("/login",login)
router.post("/signup",signup)
router.post("/verify-otp",validateOTP)

module.exports=router;