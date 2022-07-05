const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  host: "smtp.zoho.in",
  secure: true,
  port: 465,
  auth: {
    user: process.env.ZOHO_USER_MAIL,
    pass: process.env.ZOHO_APP_PASSWORD,
  },
});

module.exports = transporter;
