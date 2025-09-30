import { NextRequest, NextResponse } from 'next/server';
import { SupabaseMobileOTPStore, type MobileOTPRecord } from '@/lib/supabase-otp-store';

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json(
        { error: 'Mobile number and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP record
    const storedData = await SupabaseMobileOTPStore.get(mobile);

    if (!storedData) {
      return NextResponse.json(
        { error: 'No verification code found for this mobile number. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > new Date(storedData.expires_at)) {
      // Clean up expired OTP
      await SupabaseMobileOTPStore.delete(mobile);
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check and try again.' },
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
        { error: 'Failed to verify code' },
        { status: 500 }
      );
    }

    console.log(`✅ Mobile number verified: ${mobile}`);

    return NextResponse.json({
      success: true,
      message: 'Mobile number verified successfully',
      verified: true
    });

  } catch (error) {
    console.error('Error verifying mobile OTP:', error);
    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    );
  }
}