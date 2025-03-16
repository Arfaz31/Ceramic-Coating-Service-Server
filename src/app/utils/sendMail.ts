import nodemailer from 'nodemailer';
import { config } from '../config';

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.mail_user,
      pass: config.mail_pass,
      //'fubb ivsr vnis yeoi'
    },
  });

  const mailOptions = {
    from: 'arfazahamed1@gmail.com',
    to,
    subject: 'Password Reset - CeramicShield-pro',
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #dddddd; border-radius: 10px;">
    <h1 style="color: #0073e6; text-align: center;">CeramicShield-pro</h1>
    <h3 style="color: #333333;">Reset Your Password</h3>
    <p style="color: #333333; font-size: 16px;">
      Hi there,
    </p>
    <p style="color: #333333; font-size: 16px;">
      We received a request to reset the password associated with your account. If you didn't request a password reset, please ignore this email.
    </p>
    <p style="color: #333333; font-size: 16px;">
      To reset your password, please click the button below:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetLink}" style="background-color: #0073e6; color: white; padding: 10px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">Reset Password</a>
    </div>
    <p style="color: #333333; font-size: 16px;">
      Alternatively, you can copy and paste the following link into your browser:
    </p>
    <p style="color: #0073e6; font-size: 16px; word-wrap: break-word;">
      ${resetLink}
    </p>
    <p style="color: #333333; font-size: 16px;">
      Thanks,<br/>
      The CeramicShield-pro Team
    </p>
    <hr style="border: 0; border-top: 1px solid #dddddd;">
    <p style="font-size: 12px; color: #aaaaaa; text-align: center;">
      If you have any issues, please contact us at ceramicshieldpro@gmail.com.<br/>
      © 2024 PetTales. All rights reserved.
    </p>
  </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
