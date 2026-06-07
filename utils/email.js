const nodemailer = require('nodemailer');

const sendEmail =async options => {
    //1) create a transporter

    const transporter = nodemailer.createTransport({
        // service:'Gmail',
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
        //Activate in gmail "less secure app" option
    })

    //2)Define the email optins

    const mailOptions = {
        from:'Akshay Zagade',
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    //3)Actually send the email
   await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;
//Sending Onboarding API token 19ea2108eae: ea4ca21155959b81392d5b45d071d989