const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");
const OAuth2 = google.auth.OAuth2;

const getGmailService =async () => {
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground");
    oAuth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN
    });
  
    const accessToken = await new Promise((resolve, reject) => {
      oAuth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });
  oAuth2Client.setCredentials({
    "access_token": accessToken, 
    "scope": "https://www.googleapis.com/auth/gmail.send", 
    "expires_in": 3599, 
    "token_type": "Bearer"
  });
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);
  const message = await mailComposer.compile().build();
  return encodeMessage(message);
};

const sendMail = async (options) => {
  const gmail =await getGmailService();
  const rawMessage = await createMail(options);
  const { data: { id } = {} } = await gmail.users.messages.send({
    userId: 'me',
    resource: {
      raw: rawMessage,
    },
  });
  return id;
};
const sendEmail = async (email, subject, text) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   // host: "smtp.ethereal.email",
    //   service:"gmail",
    //   // port: 587,
    //   // secure: false,
    //   auth: {
    //     type: "OAuth2",
    //     user: process.env.USER,
    //     pass: process.env.PASS,
    //     clientId: process.env.CLIENT_ID,
    //     clientSecret: process.env.CLIENT_SECRET,
    //     refreshToken: process.env.REFRESH_TOKEN
    //   },
    //   tls: {
    //     rejectUnauthorized: false
    //   }
    // });

    // const oauth2Client = new OAuth2(
    //   process.env.CLIENT_ID,
    //   process.env.CLIENT_SECRET,
    //   "https://developers.google.com/oauthplayground"
    // );
    
    // oauth2Client.setCredentials({
    //   refresh_token: process.env.REFRESH_TOKEN
    // });
  
    // const accessToken = await new Promise((resolve, reject) => {
    //   oauth2Client.getAccessToken((err, token) => {
    //     if (err) {
    //       reject("Failed to create access token :(");
    //     }
    //     resolve(token);
    //   });
    // });
    // console.log(accessToken);
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     type: "OAuth2",
    //     user: process.env.USER,
    //     accessToken,
    //     clientId: process.env.CLIENT_ID,
    //     clientSecret: process.env.CLIENT_SECRET,
    //     refreshToken: process.env.REFRESH_TOKEN
    //   },
    //   tls: {
    //     rejectUnauthorized: false
    //   }
    // });
    const messageId = await sendMail({
      from: "admin@mathongo.in",
      to: "sreedevi2301051@gmail.com",
      subject: subject,
      text: text,
    });
  return messageId;
    // await transporter.sendMail({
    //   from: "admin@mathongo.in",
    //   to: process.env.USER,
    //   subject: subject,
    //   text: text,
    // });

    // console.log("email sent sucessfully");
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = sendEmail;