import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// SMTP, not a vendor SDK: any provider that speaks SMTP (Brevo, Gmail,
// SMTP2GO, SES...) works here just by changing the env vars below.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // false = STARTTLS on 587, not implicit TLS on 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM_ADDRESS, // Must match the provider's verified sender
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(msg);
    console.log(` Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(` Failed to send email to ${to}:`, error);
    throw error;
  }
};
