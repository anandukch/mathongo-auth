const { requestPasswordReset, processPasswordReset } = require('../controller/passwordReset');

const router=require('express').Router();

router.post("/",requestPasswordReset)
router.post("/:userId/:token",processPasswordReset)
router.get("/:userId/:token",async (req,res)=>{
  const {userId, token}=req.params;
  res.render("password-reset",{userId, token})
})

module.exports=router;