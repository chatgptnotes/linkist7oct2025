import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/resend-email-service';
import { rateLimitMiddleware, RateLimits } from '@/lib/rate-limit';
import { emailOTPStore, generateOTP } from '@/lib/email-otp-store';

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request, RateLimits.otp);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { email } = body;

    console.log('📧 Sending email OTP to:', email);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Clean up expired OTPs
    emailOTPStore.cleanExpired();

    // Rate limiting: Check if OTP was sent recently
    const existingOtp = emailOTPStore.get(email);
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
    const expiresInMinutes = 5;

    // Store OTP in shared store
    emailOTPStore.set(email, {
      otp,
      expiresAt,
      attempts: 0
    });

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isSMTPConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

    // Log SMTP configuration status
    console.log('🔧 SMTP Configuration Status:', {
      isDevelopment,
      isSMTPConfigured,
      hasHost: Boolean(process.env.SMTP_HOST),
      hasPort: Boolean(process.env.SMTP_PORT),
      hasUser: Boolean(process.env.SMTP_USER),
      hasPass: Boolean(process.env.SMTP_PASS),
      NODE_ENV: process.env.NODE_ENV
    });

    // Send OTP via SMTP
    if (!isSMTPConfigured) {
      console.error('❌ SMTP not configured - missing credentials');

      // In production, return error instead of success
      if (!isDevelopment) {
        return NextResponse.json({
          success: false,
          error: 'Email service not configured. Please contact support.',
          emailStatus: 'not_configured'
        }, { status: 500 });
      }

      // In development, allow fallback with console log
      console.log(`📧 [DEV FALLBACK] Email OTP for ${email}: ${otp}`);
      return NextResponse.json({
        success: true,
        message: 'Verification code generated (check console - email service not configured)',
        devOtp: otp,
        emailStatus: 'not_configured'
      });
    }

    // Try to send email
    try {
      console.log(`📤 Attempting to send OTP email to ${email}...`);
      const emailResult = await sendOTPEmail({
        to: email,
        otp,
        expiresInMinutes
      });

      if (emailResult.success) {
        console.log(`✅ Email OTP sent successfully to ${email} via SMTP`);

        return NextResponse.json({
          success: true,
          message: 'Verification code sent to your email',
          ...(isDevelopment && { devOtp: otp }),
          emailStatus: 'sent'
        });
      } else {
        // SMTP failed - return actual error
        console.error('❌ SMTP sending failed:', emailResult.error);

        return NextResponse.json({
          success: false,
          error: `Failed to send verification email: ${emailResult.error || 'Unknown error'}`,
          details: emailResult.error,
          emailStatus: 'failed',
          ...(isDevelopment && { devOtp: otp })
        }, { status: 500 });
      }
    } catch (emailError) {
      console.error('❌ Email sending exception:', emailError);

      return NextResponse.json({
        success: false,
        error: 'Failed to send verification email',
        details: emailError instanceof Error ? emailError.message : String(emailError),
        emailStatus: 'error',
        ...(isDevelopment && { devOtp: otp })
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}
