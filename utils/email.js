import nodemailer from 'nodemailer';
import { configDotenv } from 'dotenv';

configDotenv();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${subject}</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            ${message}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This is an automated message, please do not reply.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}; 