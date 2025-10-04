import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { SupabaseMobileOTPStore, generateMobileOTP, cleanExpiredOTPs } from '@/lib/supabase-otp-store';
import { rateLimitMiddleware, RateLimits, getClientIdentifier } from '@/lib/rate-limit';
import { checkSpamAndBots } from '@/lib/spam-detection';

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

    // Check for spam and bot activity
    const ipAddress = getClientIdentifier(request);
    const userAgent = request.headers.get('user-agent');

    const spamCheck = await checkSpamAndBots(mobile, ipAddress, userAgent);

    if (!spamCheck.allowed) {
      console.warn(`🚫 Blocked OTP request - Phone: ${mobile}, IP: ${ipAddress}, Reason: ${spamCheck.reason}, Risk Score: ${spamCheck.riskScore}`);

      return NextResponse.json(
        {
          success: false,
          error: spamCheck.reason || 'Request blocked',
          retryAfter: spamCheck.retryAfter,
          riskScore: spamCheck.riskScore,
        },
        {
          status: 429,
          headers: spamCheck.retryAfter
            ? { 'Retry-After': spamCheck.retryAfter.toString() }
            : {},
        }
      );
    }

    // Log elevated risk but allow
    if (spamCheck.riskScore > 30) {
      console.warn(`⚠️ Elevated risk score: ${spamCheck.riskScore} for phone ${mobile} from IP ${ipAddress}`);
    }

    // Use database OTP only if Twilio not configured (not based on NODE_ENV)
    const useDatabaseOTP = !accountSid || !authToken || !verifyServiceSid;

    console.log('🔍 SMS OTP Debug:', {
      accountSid: accountSid ? 'Set' : 'Missing',
      authToken: authToken ? 'Set' : 'Missing',
      verifyServiceSid: verifyServiceSid ? 'Set' : 'Missing',
      useDatabaseOTP,
      mobile
    });

    if (useDatabaseOTP) {
      // Generate OTP and store in database for development
      const otp = generateMobileOTP();
      const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString();

      await cleanExpiredOTPs();
      const stored = await SupabaseMobileOTPStore.set(mobile, {
        mobile,
        otp,
        expires_at: expiresAt,
        verified: false
      });

      if (!stored) {
        console.error('Failed to store OTP in database');
        return NextResponse.json(
          { success: false, error: 'Failed to generate verification code' },
          { status: 500 }
        );
      }

      console.log(`📱 Mobile OTP for ${mobile}: ${otp} (stored in database)`);

      return NextResponse.json({
        success: true,
        message: 'Verification code generated',
        devOtp: otp, // Show OTP in development
        smsStatus: 'database'
      });
    }

    try {
      // Initialize Twilio client
      console.log('📞 Initializing Twilio client...');
      const client = twilio(accountSid, authToken);

      // Send verification code using Twilio Verify API
      // Note: Twilio generates and manages the OTP, we don't need to store it
      console.log('📤 Sending SMS to:', mobile);
      const verification = await client.verify.v2
        .services(verifyServiceSid)
        .verifications.create({
          to: mobile,
          channel: 'sms'
        });

      console.log('✅ Twilio verification sent:', verification.status);

      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your mobile number',
        status: verification.status,
        smsStatus: 'sent'
      });

    } catch (error: any) {
      console.error('❌ Twilio error:', {
        message: error.message,
        code: error.code,
        status: error.status,
        moreInfo: error.moreInfo
      });

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

      // Fallback: Generate OTP and store in database
      console.log('⚠️ SMS failed, using database OTP as fallback');
      const otp = generateMobileOTP();
      const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString();

      await cleanExpiredOTPs();
      await SupabaseMobileOTPStore.set(mobile, {
        mobile,
        otp,
        expires_at: expiresAt,
        verified: false
      });

      console.log(`📱 Fallback OTP for ${mobile}: ${otp}`);

      return NextResponse.json({
        success: true,
        message: 'Verification code generated (SMS delivery failed)',
        devOtp: otp, // Always show in fallback mode
        smsStatus: 'fallback',
        twilioError: error.message
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
