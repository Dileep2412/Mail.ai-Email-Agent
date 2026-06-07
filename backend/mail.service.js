import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html, text = "" }) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Mail.ai <onboarding@resend.dev>",
      to,
      subject,
      html,
      text,
    });
    
    if (error) throw new Error(error.message);
    
    console.log("? Email sent via Resend");
    return `Email sent successfully to ${to}`;
  } catch (error) {
    console.log("? Send Mail Error:", error.message);
    throw error;
  }
}
