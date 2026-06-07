import nodemailer from "nodemailer";


// Transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GOOGLE_USER,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});

// Verify Connection
transporter.verify()
    .then(() => {
        console.log("✅ Email transporter is ready");
    })
    .catch((err) => {
        console.error("❌ Email transporter failed:", err);
    });

// Send Email Function
export async function sendEmail({
    to,
    subject,
    html,
    text = ""
}) {
    try {
        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        };


        const details =
            await transporter.sendMail(mailOptions);
        console.log("✅ Email sent");
        console.log(details.response);
        return `Email sent successfully to ${to}`;
    } catch (error) {
        console.log("❌ Send Mail Error");
        console.log(error.message);
        throw error;
    }
}