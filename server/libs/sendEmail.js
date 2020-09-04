const nodemailer = require("nodemailer");
const config = require("../config/config");
const html = require("./welcome");
let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.google_email,
    pass: config.google_password,
  },
});
module.exports = (email, token, nickname) => {
  const sendEmail = transporter.sendMail({
    from: `"LivingIn Team" <${config.google_email}>`,
    to: email,
    subject: `[자취인] ${nickname}님의 회원가입 인증메일입니다.`,
    // 보내는 메일의 내용을 입력
    // text: 일반 text로 작성된 내용
    // html: html로 작성된 내용
    html: html(nickname, token, email),
  });
  return sendEmail;
};
