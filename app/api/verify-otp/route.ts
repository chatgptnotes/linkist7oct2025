import { NextRequest, NextResponse } from 'next/server';
import { SupabaseEmailOTPStore, SupabaseMobileOTPStore, type EmailOTPRecord } from '@/lib/supabase-otp-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import { SessionStore } from '@/lib/session-store';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, mobile, otp } = body;

    // Accept either email or mobile
    const identifier = mobile || email;

    if (!identifier || !otp) {
      return NextResponse.json(
        { error: 'Email/Phone and OTP are required' },
        { status: 400 }
      );
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const isPhone = !isEmail;

    console.log('🔐 [verify-otp] Starting OTP verification for:', identifier, 'Type:', isEmail ? 'email' : 'phone');

    let user = null;

    // ==================== PHONE OTP VERIFICATION ====================
    if (isPhone) {
      console.log('📱 [verify-otp] Verifying phone OTP for:', identifier);

      // Clean and format phone number to match what was used in send-otp
      let phoneToVerify = identifier.replace(/[\s-()]/g, '');

      // Try multiple phone formats
      const phoneFormats = [
        phoneToVerify,                    // As entered
        `+${phoneToVerify}`,              // With + prefix
        `+91${phoneToVerify}`,            // With India country code
        phoneToVerify.replace(/^\\+/, '') // Without + if present
      ];

      console.log('📱 [verify-otp] Will try phone formats:', phoneFormats);

      // Check if Twilio is configured
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
      const useTwilio = twilioAccountSid && twilioAuthToken && twilioVerifyServiceSid;

      if (useTwilio) {
        let twilioSuccess = false;
        let lastTwilioError = null;

        // Try each phone format with Twilio
        for (const phoneFormat of phoneFormats) {
          try {
            console.log('📞 [verify-otp] Trying Twilio verification with:', phoneFormat);
            const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

            const verificationCheck = await twilioClient.verify.v2
              .services(twilioVerifyServiceSid)
              .verificationChecks.create({
                to: phoneFormat,
                code: otp
              });

            console.log('✅ [verify-otp] Twilio verification result:', verificationCheck.status, 'for format:', phoneFormat);

            if (verificationCheck.status === 'approved') {
              twilioSuccess = true;
              phoneToVerify = phoneFormat; // Use the format that worked
              break;
            }
          } catch (twilioError: any) {
            console.error('❌ [verify-otp] Twilio verification failed for format:', phoneFormat, 'Error:', twilioError.message);
            lastTwilioError = twilioError;
            // Continue trying other formats
          }
        }

        // If all Twilio attempts failed, try database fallback
        if (!twilioSuccess) {
          console.log('⚠️ [verify-otp] All Twilio formats failed, falling back to database verification');
          console.log('⚠️ [verify-otp] Last Twilio error:', lastTwilioError?.message);

          const storedRecord = await SupabaseMobileOTPStore.get(phoneToVerify);

          if (!storedRecord) {
            return NextResponse.json(
              { error: 'No verification code found. Please request a new code.' },
              { status: 400 }
            );
          }

          if (new Date() > new Date(storedRecord.expires_at)) {
            await SupabaseMobileOTPStore.delete(identifier);
            return NextResponse.json(
              { error: 'Verification code has expired. Please request a new code.' },
              { status: 400 }
            );
          }

          if (storedRecord.otp !== otp) {
            return NextResponse.json(
              { error: 'Invalid verification code. Please check and try again.' },
              { status: 400 }
            );
          }

          // Mark as verified
          await SupabaseMobileOTPStore.set(identifier, {
            ...storedRecord,
            verified: true
          });

          // Clean up
          await SupabaseMobileOTPStore.delete(identifier);
        }
      } else {
        // No Twilio, use database verification
        console.log('📱 [verify-otp] Verifying from database');
        const storedRecord = await SupabaseMobileOTPStore.get(identifier);

        if (!storedRecord) {
          return NextResponse.json(
            { error: 'No verification code found. Please request a new code.' },
            { status: 400 }
          );
        }

        if (new Date() > new Date(storedRecord.expires_at)) {
          await SupabaseMobileOTPStore.delete(identifier);
          return NextResponse.json(
            { error: 'Verification code has expired. Please request a new code.' },
            { status: 400 }
          );
        }

        if (storedRecord.otp !== otp) {
          return NextResponse.json(
            { error: 'Invalid verification code. Please check and try again.' },
            { status: 400 }
          );
        }

        // Mark as verified
        await SupabaseMobileOTPStore.set(identifier, {
          ...storedRecord,
          verified: true
        });

        // Clean up
        await SupabaseMobileOTPStore.delete(identifier);
      }

      console.log('✅ [verify-otp] Phone OTP verified successfully');

      // Try to get user from database with multiple phone formats
      for (const phoneFormat of phoneFormats) {
        user = await SupabaseUserStore.getByPhone(phoneFormat);
        if (user) {
          console.log('✅ [verify-otp] Found user with phone format:', phoneFormat);
          break;
        }
      }

      if (!user) {
        console.error('❌ [verify-otp] User not found for any phone format. Tried:', phoneFormats);
        return NextResponse.json(
          { error: 'User account not found. Please register first.' },
          { status: 404 }
        );
      }

      // Update mobile verification status
      await SupabaseUserStore.updateVerificationStatus(user.email, 'mobile', true);
    }

    // ==================== EMAIL OTP VERIFICATION ====================
    if (isEmail) {
      console.log('📧 [verify-otp] Verifying email OTP');
      const storedRecord = await SupabaseEmailOTPStore.get(identifier);

      if (!storedRecord) {
        return NextResponse.json(
          { error: 'No verification code found for this email. Please request a new code.' },
          { status: 400 }
        );
      }

      if (new Date() > new Date(storedRecord.expires_at)) {
        await SupabaseEmailOTPStore.delete(identifier);
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new code.' },
          { status: 400 }
        );
      }

      if (storedRecord.otp !== otp) {
        return NextResponse.json(
          { error: 'Invalid verification code. Please check and try again.' },
          { status: 400 }
        );
      }

      console.log('✅ [verify-otp] Email OTP verified successfully');

      // Mark as verified
      await SupabaseEmailOTPStore.set(identifier, {
        ...storedRecord,
        verified: true
      });

      // Get user from database
      user = await SupabaseUserStore.getByEmail(identifier);

      if (!user) {
        console.error('❌ [verify-otp] User not found for email:', identifier);
        return NextResponse.json(
          { error: 'User account not found. Please register first.' },
          { status: 404 }
        );
      }

      // Update email verification status
      await SupabaseUserStore.updateVerificationStatus(identifier, 'email', true);

      // Clean up
      await SupabaseEmailOTPStore.delete(identifier);
    }

    // ==================== CREATE SESSION ====================
    if (!user) {
      return NextResponse.json(
        { error: 'User account not found.' },
        { status: 404 }
      );
    }

    console.log('✅ [verify-otp] User found:', user.id);

    // Create user session
    const sessionId = await SessionStore.create(user.id, user.email, user.role);
    console.log('🔑 [verify-otp] Session created:', sessionId);

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verified: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        email_verified: user.email_verified,
        role: user.role
      }
    });

    // Set HTTP-only session cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/'
    };

    response.cookies.set('session', sessionId, cookieOptions);

    return response;

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}