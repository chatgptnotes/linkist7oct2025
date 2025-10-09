import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/smtp-email-service';
import { SupabaseEmailOTPStore, SupabaseMobileOTPStore, generateEmailOTP, generateMobileOTP, cleanExpiredOTPs, type EmailOTPRecord } from '@/lib/supabase-otp-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import twilio from 'twilio';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailOrPhone } = body;

    if (!emailOrPhone || typeof emailOrPhone !== 'string') {
      return NextResponse.json(
        { error: 'Email or phone number is required' },
        { status: 400 }
      );
    }

    // Determine if input is email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[+]?[\d\s-()]+$/;

    const isEmail = emailRegex.test(emailOrPhone);
    const isPhone = phoneRegex.test(emailOrPhone.replace(/[\s-()]/g, ''));

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { error: 'Invalid email or phone number format' },
        { status: 400 }
      );
    }

    // Check if user exists in Supabase users table
    let user = null;
    let userEmail = '';
    let userPhone = '';

    if (isEmail) {
      user = await SupabaseUserStore.getByEmail(emailOrPhone);
      userEmail = emailOrPhone;
    } else if (isPhone) {
      // Clean phone number (remove spaces, dashes, parentheses)
      let cleanPhone = emailOrPhone.replace(/[\s-()]/g, '');

      // Try multiple phone number formats
      const phoneVariants = [
        cleanPhone,                    // As entered
        `+${cleanPhone}`,              // With + prefix
        `+91${cleanPhone}`,            // With India country code
        cleanPhone.replace(/^\+/, '')  // Remove + if present
      ];

      console.log('🔍 Trying phone number variants:', phoneVariants);

      // Try each variant until we find a match
      for (const variant of phoneVariants) {
        user = await SupabaseUserStore.getByPhone(variant);
        if (user) {
          console.log('✅ Found user with phone variant:', variant);
          userPhone = user.phone_number || variant; // Use stored phone number
          break;
        }
      }

      if (user && user.email) {
        userEmail = user.email;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email or phone number. Please register first.' },
        { status: 404 }
      );
    }

    // For phone login, we need the phone number for SMS
    // For email login, we need the email
    if (isPhone && !userPhone) {
      return NextResponse.json(
        { error: 'User account found but no phone number associated. Please contact support.' },
        { status: 400 }
      );
    }

    if (isEmail && !userEmail) {
      return NextResponse.json(
        { error: 'User account found but no email associated. Please contact support.' },
        { status: 400 }
      );
    }

    // Clean expired OTPs first
    await cleanExpiredOTPs();

    // ==================== PHONE NUMBER LOGIN (SMS) ====================
    if (isPhone && userPhone) {
      console.log('📱 Phone login detected, sending SMS OTP to:', userPhone);

      // Check if Twilio is configured
      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
      const useTwilio = twilioAccountSid && twilioAuthToken && twilioVerifyServiceSid;

      if (useTwilio) {
        // Use Twilio SMS
        try {
          console.log('📞 [send-otp] Sending SMS via Twilio to:', userPhone);
          console.log('📞 [send-otp] IMPORTANT: Store this phone format for verification:', userPhone);
          const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

          const verification = await twilioClient.verify.v2
            .services(twilioVerifyServiceSid)
            .verifications.create({
              to: userPhone,
              channel: 'sms'
            });

          console.log('✅ [send-otp] Twilio SMS sent successfully:', verification.status);
          console.log('✅ [send-otp] SMS sent to phone number:', userPhone);

          // Store identifier for verification (use email for session later)
          return NextResponse.json({
            success: true,
            message: 'Verification code sent to your mobile number via SMS',
            type: 'sms',
            identifier: userPhone,
            userEmail: userEmail, // Store email for session creation
            smsStatus: 'sent'
          });

        } catch (twilioError: any) {
          console.error('❌ Twilio SMS error:', twilioError);

          // Fallback to database OTP
          const otp = generateMobileOTP();
          const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString();

          await SupabaseMobileOTPStore.set(userPhone, {
            mobile: userPhone,
            otp,
            expires_at: expiresAt,
            verified: false
          });

          console.log('📱 Fallback OTP stored in database:', otp);

          return NextResponse.json({
            success: true,
            message: 'Verification code generated (SMS delivery may be delayed)',
            type: 'sms',
            identifier: userPhone,
            userEmail: userEmail,
            devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
            smsStatus: 'fallback',
            twilioError: twilioError.message
          });
        }
      } else {
        // No Twilio configured, use database OTP
        console.log('⚠️ Twilio not configured, using database OTP');
        const otp = generateMobileOTP();
        const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString();

        await SupabaseMobileOTPStore.set(userPhone, {
          mobile: userPhone,
          otp,
          expires_at: expiresAt,
          verified: false
        });

        console.log('📱 Database OTP generated:', otp);

        return NextResponse.json({
          success: true,
          message: 'Verification code generated',
          type: 'sms',
          identifier: userPhone,
          userEmail: userEmail,
          devOtp: otp, // Always show in dev mode
          smsStatus: 'database'
        });
      }
    }

    // ==================== EMAIL LOGIN ====================
    if (isEmail && userEmail) {
      console.log('📧 Email login detected, sending email OTP to:', userEmail);

      // Check if SMTP is configured
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass) {
        return NextResponse.json(
          { error: 'Email service not configured' },
          { status: 503 }
        );
      }

      // Generate OTP
      const otp = generateEmailOTP();
      const expiresAt = new Date(Date.now() + (10 * 60 * 1000)).toISOString();

      // Store OTP in Supabase
      const stored = await SupabaseEmailOTPStore.set(userEmail, {
        email: userEmail,
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

      // Send email OTP
      let emailSent = false;
      let emailError = null;

      try {
        console.log('📧 Sending email OTP to:', userEmail);
        const emailResult = await sendOTPEmail({
          to: userEmail,
          otp,
          expiresInMinutes: 10
        });

        if (!emailResult.success) {
          console.error('❌ Email sending failed:', emailResult.error);
          emailError = emailResult.error;
          if (process.env.NODE_ENV === 'production') {
            throw new Error(emailResult.error);
          }
        } else {
          emailSent = true;
          console.log('✅ Email sent successfully');
        }
      } catch (error) {
        console.error('❌ Failed to send email:', error);
        emailError = error instanceof Error ? error.message : String(error);
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { error: 'Failed to send verification email', details: emailError },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: emailSent ? 'Verification code sent to your email' : 'OTP generated (email failed to send)',
        type: 'email',
        identifier: userEmail,
        devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        emailSent,
        emailError: process.env.NODE_ENV === 'development' ? emailError : undefined
      });
    }

    // Should never reach here
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );

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