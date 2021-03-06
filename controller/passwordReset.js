const Joi = require("joi");
const Token = require("../models/token");
const { User } = require("../models/user");
const crypto = require("crypto");
const sendEmail = require("../utils/mailer");
module.exports.requestPasswordReset = async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");
        if (!user.isVerified) {
            return res.status(400).send("Please verify your email");
        }
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const link = `${process.env.PROD ? process.env.PROD_URL : process.env.DEV_URL}/api/password-reset/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);

        return res.send("password reset link sent to your email account");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}

module.exports.processPasswordReset = async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = req.body.password;
        await user.save();
        await token.delete();

        return res.status(200).json({
            message: "password reset successfully",
        });
    } catch (error) {
        res.status(400).send("Invalid link or expired");
        console.log(error);
    }
}