import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { SupabaseMobileOTPStore } from '@/lib/supabase-otp-store';
import { createClient } from '@supabase/supabase-js';
import { rateLimitMiddleware, RateLimits } from '@/lib/rate-limit';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
  // Apply strict rate limiting for OTP verification
  const rateLimitResponse = rateLimitMiddleware(request, RateLimits.strict);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Verifying OTP for:', mobile);

    // Check if Twilio is configured
    const twilioConfigured = accountSid && authToken && verifyServiceSid;

    if (twilioConfigured) {
      try {
        // Verify using Twilio Verify API
        const client = twilio(accountSid, authToken);

        const verificationCheck = await client.verify.v2
          .services(verifyServiceSid)
          .verificationChecks.create({
            to: mobile,
            code: otp
          });

        console.log('Twilio verification status:', verificationCheck.status);

        if (verificationCheck.status === 'approved') {
          // Update user's mobile_verified status in database
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          const userEmail = request.cookies.get('userEmail')?.value;

          if (userEmail) {
            await supabase
              .from('users')
              .update({ mobile_verified: true, phone_number: mobile })
              .eq('email', userEmail);
          }

          // Mark as verified in OTP store
          const storedData = await SupabaseMobileOTPStore.get(mobile);
          if (storedData) {
            await SupabaseMobileOTPStore.set(mobile, {
              ...storedData,
              verified: true
            });
          }

          console.log(`✅ Mobile number verified via Twilio: ${mobile}`);

          return NextResponse.json({
            success: true,
            message: 'Mobile number verified successfully',
            verified: true
          });
        } else {
          return NextResponse.json(
            { success: false, error: 'Invalid verification code. Please try again.' },
            { status: 400 }
          );
        }

      } catch (error: any) {
        console.error('❌ Twilio verification error:', error);

        // Handle specific Twilio errors
        if (error.code === 60202) {
          return NextResponse.json(
            { success: false, error: 'Max verification attempts reached. Please request a new code.' },
            { status: 429 }
          );
        }

        if (error.code === 60200) {
          return NextResponse.json(
            { success: false, error: 'Invalid phone number format.' },
            { status: 400 }
          );
        }

        // Fallback to database verification
        console.log('Falling back to database verification...');
      }
    }

    // Fallback verification using database (when Twilio not configured or failed)
    const storedData = await SupabaseMobileOTPStore.get(mobile);

    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'No verification code found for this mobile number. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > new Date(storedData.expires_at)) {
      await SupabaseMobileOTPStore.delete(mobile);
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Mark as verified in database
    const updated = await SupabaseMobileOTPStore.set(mobile, {
      ...storedData,
      verified: true
    });

    if (!updated) {
      console.error('Failed to mark mobile OTP as verified');
      return NextResponse.json(
        { success: false, error: 'Failed to verify code' },
        { status: 500 }
      );
    }

    // Update user's mobile_verified status in database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const userEmail = request.cookies.get('userEmail')?.value;

    if (userEmail) {
      await supabase
        .from('users')
        .update({ mobile_verified: true, phone_number: mobile })
        .eq('email', userEmail);
    }

    console.log(`✅ Mobile number verified (database): ${mobile}`);

    return NextResponse.json({
      success: true,
      message: 'Mobile number verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Error verifying mobile OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    );
  }
}
