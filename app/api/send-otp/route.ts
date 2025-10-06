import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/smtp-email-service';
import { SupabaseEmailOTPStore, generateEmailOTP, cleanExpiredOTPs, type EmailOTPRecord } from '@/lib/supabase-otp-store';

export async function POST(request: NextRequest) {
  // Check if SMTP is configured
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) {
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Clean expired OTPs first
    await cleanExpiredOTPs();
    
    // Generate OTP
    const otp = generateEmailOTP();
    const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString(); // 10 minutes expiry

    // Store OTP in Supabase
    const stored = await SupabaseEmailOTPStore.set(email, {
      email,
      otp,
      expires_at: expiresAt,
      verified: false
    });

    if (!stored) {
      console.error('Failed to store OTP in database');
      return NextResponse.json(
        { error: 'Failed to store verification code' },
        { status: 500 }
      );
    }

    // Send actual email using SMTP
    let emailSent = false;
    let emailError = null;

    try {
      if (smtpUser && smtpPass) {
        console.log('🔄 Attempting to send OTP email to:', email);
        const emailResult = await sendOTPEmail({
          to: email,
          otp,
          expiresInMinutes: 10
        });

        if (!emailResult.success) {
          console.error('❌ Email sending failed:', emailResult.error);
          emailError = emailResult.error;
          // In development, continue so user can still use OTP from devOtp field
          if (process.env.NODE_ENV === 'production') {
            throw new Error(emailResult.error);
          }
        } else {
          emailSent = true;
          console.log('✅ Email sent successfully');
        }
      }
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      emailError = error instanceof Error ? error.message : String(error);
      // In production, return error
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Failed to send verification email', details: emailError },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: emailSent ? 'Verification code sent successfully' : 'OTP generated (email failed to send)',
      // 🚨 TEMPORARY: Always show OTP in development until email is configured properly
      // TODO: Remove once SMTP email delivery is verified
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
      emailSent,
      emailError: process.env.NODE_ENV === 'development' ? emailError : undefined
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // For development - show current OTPs
  if (process.env.NODE_ENV === 'development') {
    const records = await SupabaseEmailOTPStore.getAllForDev();
    const currentOTPs = records.map((record) => ({
      email: record.email,
      otp: record.otp,
      expiresAt: record.expires_at,
      expired: new Date() > new Date(record.expires_at),
      verified: record.verified
    }));
    
    return NextResponse.json({ otps: currentOTPs });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}