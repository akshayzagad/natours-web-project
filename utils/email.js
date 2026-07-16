const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Akshay Zagade <${process.env.EMAIL_FROM}>`;
  }
 newTransporter() {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false, // uses STARTTLS on 587
      auth: {
        user: "apikey", // literally the string "apikey" — SendGrid convention
        pass: process.env.SENDGRID_PASSWORD, // your actual SendGrid API key
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}
  //send actual email
  
  async send(template, subject) {
  console.log("NODE_ENV:", process.env.NODE_ENV);

  const transporter = this.newTransporter();

  console.log("Transporter created");

  const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
    firstName: this.firstName,
    url: this.url,
    subject,
  });

  const mailOptions = {
    from: this.from,
    to: this.to,
    subject,
    html,
    text: htmlToText.convert(html),
  };

  console.log("Sending mail...");

  try {
  await transporter.sendMail(mailOptions);
  } catch (error) {
     console.error(error);
  }

  console.log("Mail sent successfully");
}

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
//     console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('FROM:', this.from);
  }
  async sendPasswordReset() {
    await this.send(
      "PasswordReset",
      "Your password reset token valif for only 10 minutes",
    );
  }
};
//Sending Onboarding API token 19ea2108eae: ea4ca21155959b81392d5b45d071d989
//6KPDDT2MGVYKL4WTFG3VB3VT
