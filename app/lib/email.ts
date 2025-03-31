import nodemailer from 'nodemailer';

// Configure email transport (use environment variables in production)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'user@example.com',
    pass: process.env.EMAIL_PASSWORD || 'password',
  },
});

// WARNING: Including passwords in emails is a security risk
// This implementation is a temporary solution
// A more secure approach would use a password reset flow instead
export async function sendVerificationEmail(
  email: string, 
  token: string, 
  name: string, 
  password: string
): Promise<void> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Your App" <noreply@example.com>',
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h1>Email Verification</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      
      <h2>Your Account Information</h2>
      <p><strong>Login Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Your App" <noreply@example.com>',
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
    `,
  });
}