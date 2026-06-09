// services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationCode = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Login Verification Code',
    text: `Your verification code is: ${code} (expires in 4 minutes)`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationCode };