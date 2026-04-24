import nodemailer from 'nodemailer';
import env from '../config/env';
import path from 'path';
import fs from 'fs';

/**
 * Create Nodemailer transporter from environment config
 */
const createTransporter = () => {
  // In development with fake SMTP config, we can use a "mock" transporter that logs
  if (env.NODE_ENV === 'development' && (!env.EMAIL_HOST || env.EMAIL_HOST === 'smtp.example.com')) {
    // Dev mode: log email content instead of sending
    return {
      sendMail: async (options: any) => {
        console.log('\n📧 [EMAIL DEV MODE] Would send email with:');
        console.log('   To:', options.to);
        console.log('   Subject:', options.subject);
        console.log('   HTML:', options.html?.substring(0, 200) + '...');
        console.log('');
        return { accepted: [options.to as string], rejected: [] };
      },
      verify: async () => true,
    } as any;
  }

  // Production: real SMTP transport
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  return transporter;
};

const transporter = createTransporter();

/**
 * Send password reset email
 * @param to - Recipient email
 * @param resetToken - Token for reset link
 * @param userDisplayName - User's display name for personalization
 */
export const sendPasswordResetEmail = async (
  to: string,
  resetToken: string,
  userDisplayName?: string
): Promise<void> => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Read EJS template
  const templatePath = path.join(process.cwd(), 'src', 'emails', 'templates', 'password-reset.ejs');
  let html: string;

  try {
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath, 'utf-8');
      html = template
        .replace(/\{\{resetUrl\}\}/g, resetUrl)
        .replace(/\{\{userName\}\}/g, userDisplayName || 'User');
    } else {
      // Fallback: simple HTML email if template missing
      html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>Password Reset</title></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${userDisplayName || 'User'},</p>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <p><a href="${resetUrl}" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr><p style="color: #999; font-size: 12px;">— StudyVault Team</p>
        </body>
        </html>
      `;
    }
  } catch (err) {
    console.error('Error reading email template:', err);
    // Fallback HTML
    html = `<p>Hello ${userDisplayName || 'User'},</p>
            <p>Click to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`;
  }

  const mailOptions = {
    from: env.EMAIL_FROM,
    to,
    subject: 'StudyVault – Reset Your Password',
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}:`, info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Verify email transport connection (optional health check)
 */
export const verifyEmailService = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    return false;
  }
};

export default {
  sendPasswordResetEmail,
  verifyEmailService,
};
