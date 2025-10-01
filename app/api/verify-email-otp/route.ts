import { NextRequest, NextResponse } from 'next/server';
import { emailOTPStore } from '@/lib/email-otp-store';

const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Get stored OTP from shared store
    const storedData = emailOTPStore.get(email);

    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'No verification code found. Please request a new one.' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (storedData.expiresAt < Date.now()) {
      emailOTPStore.delete(email);
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new one.' },
        { status: 410 }
      );
    }

    // Check attempts
    if (storedData.attempts >= MAX_ATTEMPTS) {
      emailOTPStore.delete(email);
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new code.' },
        { status: 429 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      // Increment attempts
      storedData.attempts += 1;
      emailOTPStore.set(email, storedData);

      const remainingAttempts = MAX_ATTEMPTS - storedData.attempts;
      return NextResponse.json(
        {
          success: false,
          error: `Invalid verification code. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`
        },
        { status: 401 }
      );
    }

    // OTP is valid! Remove it from store
    emailOTPStore.delete(email);

    console.log(`✅ Email verified successfully: ${email}`);

    // In production, you might want to:
    // 1. Update user record in database to mark email as verified
    // 2. Create a session or JWT token
    // 3. Send a welcome email

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      email: email.toLowerCase(),
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
