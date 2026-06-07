import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail({ to, subject, html, text = "" }) {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_USER,
      to,
      subject,
      html,
      text
    };
    const details = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent");
    return `Email sent successfully to ${to}`;
  } catch (error) {
    console.error("❌ Send Mail Error:", error.message);
    throw error;
  }
}
