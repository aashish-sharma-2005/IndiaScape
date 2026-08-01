const nodemailer = require("nodemailer");
async function sendMail(email,otp) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,     // your gmail
        pass: process.env.EMAIL_PASS,
        // user: process.env.EMAIL_USER,     // your gmail
        // pass: process.env.EMAIL_PASS,   // app password (NO spaces)
      },
    });
    const info = await transporter.sendMail({
      from: "indiaScape verification",
        to: email,
        subject: "verify Email",
        html: `your verification opt is ${otp}, please verify your email to complete signup process`,
    });
    if (info.accepted && info.accepted.length > 0) {
      console.log("✅ OTP sent:", email, otp);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Error:", error);
    return false
  }
}
module.exports = sendMail;