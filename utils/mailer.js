const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const MailComposer = require("nodemailer/lib/mail-composer");

const getGmailService = async () => {
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID,  //initialize the OAuth2Client
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground");
  oAuth2Client.setCredentials({                                       //set the credentials
    refresh_token: process.env.REFRESH_TOKEN
  });

  const accessToken = await new Promise((resolve, reject) => {        //get the access token
    oAuth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });
  oAuth2Client.setCredentials({                                         //set the access token
    "access_token": accessToken,
    "scope": "https://www.googleapis.com/auth/gmail.send",
    "expires_in": 3599,
    "token_type": "Bearer"
  });
  const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });      //create the gmail service
  return gmail;
};

const encodeMessage = (message) => {
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const createMail = async (options) => {
  const mailComposer = new MailComposer(options);                         //create the mail composer
  const message = await mailComposer.compile().build();                   //build the message
  return encodeMessage(message);                                          //encode the message
};

const sendEmail = async (email, subject, text) => {
  try {
    const gmail = await getGmailService();
    const rawMessage = await createMail({
      from: "admin@mathongo.in",
      to: email,
      subject: subject,
      text: text,
    });
    const { data: { id } = {} } = await gmail.users.messages.send({          //send the message
      userId: 'me',
      resource: {
        raw: rawMessage,
      },
    });
    return id;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

module.exports = sendEmail;