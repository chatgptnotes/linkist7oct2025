import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendOTPEmailParams {
  to: string;
  otp: string;
  expiresInMinutes: number;
}

export async function sendOTPEmail({ to, otp, expiresInMinutes }: SendOTPEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Linkist <noreply@linkist.ai>',
      to: [to],
      subject: 'Your Linkist Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification Code</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Linkist NFC</h1>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #111827; margin-top: 0;">Verify Your Email</h2>

            <p style="font-size: 16px; color: #4b5563;">
              Use this verification code to complete your email verification:
            </p>

            <div style="background: white; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">
                ${otp}
              </div>
            </div>

            <p style="font-size: 14px; color: #6b7280;">
              This code will expire in <strong>${expiresInMinutes} minutes</strong>.
            </p>

            <p style="font-size: 14px; color: #6b7280;">
              If you didn't request this code, please ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
              © 2025 Linkist NFC. All rights reserved.<br>
              Professional NFC business cards for modern networking.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend email error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Email sent successfully:', data?.id);
    return { success: true, id: data?.id };

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: String(error) };
  }
}
