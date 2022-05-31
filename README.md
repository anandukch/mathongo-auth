# MathonGo Auth

## Features:
1. Login
2. Signup
3. Email Validation through otp
4. Password reset

## Technologies used:
The backend makes use of google api and nodemailer for sending email,otp-generator for generatin otp,  express, Node.js and mongoDB for the database.

# Working
These are the routes:
```
app.use("/api/auth", require('./routes/auth'));
app.use("/api/password-reset", require("./routes/password-reset"));
```
## 1. Auth

The basic authentication contain login , signup and email validation.

Check the routes [here](/routes/auth.js)<br/>
CHeck the controller [here](/controller/auth.js)
* ### login -> Login with email and password. Will send otp to email if not verified
* ### signup -> Signup with username, email and password. Will send otp after completion. Next verify your account
* ### verify-email -> Email verification through otp

## 2. Password Reset

Check the routes [here](/routes/passwordReset.js) <br/>
Check the controller [here](/controller/passwordReset.js)
* ### Request Password Reset -> Send a link to the email for password reset
* ### Process Password Reset -> With the password reset link change the password
<br/><br/>
# Functions

## 1. [Mailer](/utils/mailer.js)
This function send mail to your email

## 2. [Send Otp](/utils/sendOtp.js)
Sends OTP to your mailer


