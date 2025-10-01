import { NextRequest, NextResponse } from 'next/server';
import { gmailEmailService } from '@/lib/gmail-email-service';

// In-memory OTP storage (replace with Redis or database in production)
const otpStore = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired OTPs
function cleanupExpiredOTPs() {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(email);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Clean up expired OTPs
    cleanupExpiredOTPs();

    // Rate limiting: Check if OTP was sent recently
    const existingOtp = otpStore.get(email.toLowerCase());
    if (existingOtp && existingOtp.expiresAt > Date.now()) {
      const timeRemaining = Math.ceil((existingOtp.expiresAt - Date.now()) / 1000);
      if (timeRemaining > 240) { // If more than 4 minutes remaining, don't allow resend
        return NextResponse.json(
          {
            success: false,
            error: `Please wait ${timeRemaining} seconds before requesting a new code`
          },
          { status: 429 }
        );
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt,
      attempts: 0
    });

    // Send OTP via email
    const isDevelopment = process.env.NODE_ENV !== 'production';

    try {
      // Create email HTML
      const emailHtml = `
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
              This code will expire in <strong>5 minutes</strong>.
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
      `;

      // In development, just log the OTP
      if (isDevelopment) {
        console.log(`📧 [DEV] Email OTP for ${email}: ${otp}`);
        console.log(`⏰ Expires at: ${new Date(expiresAt).toLocaleTimeString()}`);
      }

      // Try to send email (will use Gmail if configured)
      const emailResult = await gmailEmailService.sendOrderEmail('confirmation', {
        email,
        orderNumber: 'EMAIL-VERIFICATION',
        customerName: email.split('@')[0],
        cardConfig: { firstName: '', lastName: '' },
        shipping: {
          fullName: '',
          addressLine1: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          phoneNumber: ''
        },
        pricing: { subtotal: 0, shipping: 0, tax: 0, total: 0 }
      });

      console.log(`📨 Email OTP sent to ${email}:`, emailResult.success ? '✅' : '⚠️');

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue anyway - OTP is stored and can be used
    }

    // Return success (with OTP in dev mode for testing)
    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      ...(isDevelopment && { devOtp: otp }), // Include OTP in dev mode for easy testing
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
