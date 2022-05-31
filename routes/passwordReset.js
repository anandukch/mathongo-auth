const { requestPasswordReset, processPasswordReset } = require('../controller/passwordReset');

const router=require('express').Router();

router.post("/",requestPasswordReset)
router.post("/:userId/:token",processPasswordReset)

module.exports=router;