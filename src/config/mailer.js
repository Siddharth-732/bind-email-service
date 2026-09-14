import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

// Brevo's HTTPS Transactional Email API, not raw SMTP: Render's free tier
// blocks/throttles outbound SMTP (25/465/587) to curb spam abuse, but leaves
// HTTPS wide open. This travels over 443, so it isn't affected.
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async (to, subject, htmlContent) => {
  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL_FROM_ADDRESS }, // Must match the provider's verified sender
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    console.error(` Failed to send email to ${to}:`, body);
    throw new Error(body.message || `Brevo API responded with ${res.status}`);
  }

  console.log(` Email sent to ${to}: ${body.messageId}`);
  return body;
};
