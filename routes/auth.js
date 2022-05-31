const { login, signup, verifyEmail } = require('../controller/auth');

const router=require('express').Router();

router.post("/login",login);
router.post("/signup",signup);
router.post("/verify-email",verifyEmail);

module.exports=router;