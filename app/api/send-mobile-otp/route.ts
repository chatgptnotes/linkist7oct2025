import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { SupabaseMobileOTPStore, generateMobileOTP, cleanExpiredOTPs } from '@/lib/supabase-otp-store';
import { rateLimitMiddleware, RateLimits } from '@/lib/rate-limit';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

export async function POST(request: NextRequest) {
  // Apply rate limiting for OTP requests
  const rateLimitResponse = rateLimitMiddleware(request, RateLimits.otp);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { mobile } = await request.json();

    console.log('📱 Sending OTP to:', mobile);

    // Validate mobile number
    if (!mobile || typeof mobile !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid mobile number is required' },
        { status: 400 }
      );
    }

    // Validate mobile number format
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid mobile number (10-15 digits)' },
        { status: 400 }
      );
    }

    // Validate Twilio credentials
    if (!accountSid || !authToken || !verifyServiceSid) {
      console.error('❌ Twilio credentials not configured');

      // Fallback: Generate OTP and store in database for development
      const otp = generateMobileOTP();
      const expiresAt = new Date(Date.now() + (5 * 60 * 1000)).toISOString();

      await cleanExpiredOTPs();
      await SupabaseMobileOTPStore.set(mobile, {
        mobile,
        otp,
        expires_at: expiresAt,
        verified: false
      });

      console.log(`📱 DEV MODE - OTP for ${mobile}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: 'Verification code generated (SMS service not configured)',
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        smsStatus: 'not_configured'
      });
    }

    try {
      // Initialize Twilio client
      const client = twilio(accountSid, authToken);

      // Send verification code using Twilio Verify
      const verification = await client.verify.v2
        .services(verifyServiceSid)
        .verifications.create({
          to: mobile,
          channel: 'sms'
        });

      console.log('✅ OTP sent via Twilio:', verification.status);

      // Also store in our database for tracking
      const otp = generateMobileOTP();
      const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString(); // 10 minutes

      await cleanExpiredOTPs();
      await SupabaseMobileOTPStore.set(mobile, {
        mobile,
        otp,
        expires_at: expiresAt,
        verified: false
      });

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your mobile number',
        status: verification.status,
        smsStatus: 'sent'
      });

    } catch (error: any) {
      console.error('❌ Twilio error:', error);

      // Handle specific Twilio errors
      if (error.code === 60200) {
        return NextResponse.json(
          { success: false, error: 'Invalid phone number format. Please include country code (e.g., +1234567890)' },
          { status: 400 }
        );
      }

      if (error.code === 60203) {
        return NextResponse.json(
          { success: false, error: 'Max send attempts reached. Please try again later.' },
          { status: 429 }
        );
      }

      if (error.code === 60212) {
        return NextResponse.json(
          { success: false, error: 'Too many requests. Please wait before requesting another code.' },
          { status: 429 }
        );
      }

      // Fallback: Generate OTP for development
      const otp = generateMobileOTP();
      const expiresAt = new Date(Date.now() + (5 * 60 * 1000)).toISOString();

      await cleanExpiredOTPs();
      await SupabaseMobileOTPStore.set(mobile, {
        mobile,
        otp,
        expires_at: expiresAt,
        verified: false
      });

      console.log(`📱 FALLBACK - OTP for ${mobile}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: 'Verification code generated (SMS delivery failed)',
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        smsStatus: 'fallback',
        error: error.message
      });
    }

  } catch (error) {
    console.error('❌ Error in send-mobile-otp:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint for development - show current OTPs
export async function GET() {
  if (process.env.NODE_ENV === 'development') {
    await cleanExpiredOTPs();
    const records = await SupabaseMobileOTPStore.getAllForDev();
    const currentOTPs = records.map((record) => ({
      mobile: record.mobile,
      otp: record.otp,
      expiresAt: record.expires_at,
      expired: new Date() > new Date(record.expires_at),
      verified: record.verified
    }));

    return NextResponse.json({ otps: currentOTPs });
  }

  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
