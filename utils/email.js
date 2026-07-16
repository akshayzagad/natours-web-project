const sgMail = require("@sendgrid/mail");
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
    // only used in development now
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    const text = htmlToText.convert(html);

    if (process.env.NODE_ENV === "production") {
      sgMail.setApiKey(process.env.SENDGRID_PASSWORD); // 👈 THIS LINE — right here
      try {
        await sgMail.send({
          to: this.to,
          from: this.from,
          subject,
          html,
          text,
        });
        console.log("Mail sent successfully via SendGrid API");
      } catch (error) {
        console.error("SendGrid API error:", error.response?.body || error.message);
      }
      return;
    }

    // dev: still use nodemailer/SMTP locally
    const transporter = this.newTransporter();
    await transporter.sendMail({ from: this.from, to: this.to, subject, html, text });
    console.log("Mail sent successfully (dev SMTP)");
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Natours Family!");
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token valid for only 10 minutes");
  }
};