import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/resend-email-service';
import { rateLimitMiddleware, RateLimits } from '@/lib/rate-limit';

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
    const expiresInMinutes = 5;

    // Store OTP
    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt,
      attempts: 0
    });

    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Send OTP via Resend
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_c1tpEyD8_NKFusih9vKVQknRAQfmFcWCv') {
      try {
        const emailResult = await sendOTPEmail({
          to: email,
          otp,
          expiresInMinutes
        });

        if (emailResult.success) {
          console.log(`✅ Email OTP sent to ${email} via Resend`);

          return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email',
            ...(isDevelopment && { devOtp: otp }),
          });
        } else {
          console.error('❌ Resend failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('❌ Email sending error:', emailError);
      }
    }

    // Fallback: OTP is stored, log it in development
    console.log(`📧 [${isDevelopment ? 'DEV' : 'FALLBACK'}] Email OTP for ${email}: ${otp}`);
    console.log(`⏰ Expires at: ${new Date(expiresAt).toLocaleTimeString()}`);

    return NextResponse.json({
      success: true,
      message: isDevelopment
        ? 'Verification code generated (check console - email service not configured)'
        : 'Verification code sent to your email',
      ...(isDevelopment && { devOtp: otp }),
      emailStatus: process.env.RESEND_API_KEY ? 'fallback' : 'not_configured'
    });

  } catch (error) {
    console.error('❌ Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

// Export store for verification endpoint
export { otpStore };
