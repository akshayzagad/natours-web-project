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
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      // service:'Gmail',
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
    //Render html based on pug template

    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    //Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };
    //create transport and create email
    await this.newTransporter().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
    console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('FROM:', this.from);
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
