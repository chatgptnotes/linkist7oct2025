import { NextRequest, NextResponse } from 'next/server';
import { SupabaseEmailOTPStore, type EmailOTPRecord } from '@/lib/supabase-otp-store';
import { UserStore, type User } from '@/lib/user-store';
import { SessionStore } from '@/lib/session-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP record
    const storedRecord = await SupabaseEmailOTPStore.get(email);

    if (!storedRecord) {
      return NextResponse.json(
        { error: 'No verification code found for this email. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date() > new Date(storedRecord.expires_at)) {
      // Clean up expired OTP
      await SupabaseEmailOTPStore.delete(email);
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (storedRecord.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please check and try again.' },
        { status: 400 }
      );
    }

    // Mark as verified in database
    const updated = await SupabaseEmailOTPStore.set(email, {
      ...storedRecord,
      verified: true
    });

    if (!updated) {
      console.error('Failed to mark OTP as verified');
      return NextResponse.json(
        { error: 'Failed to verify code' },
        { status: 500 }
      );
    }

    // Get or create user account
    let user = UserStore.getByEmail(email);

    if (!user) {
      // Create new user account
      user = UserStore.create(email);
    }

    // Create user session using new session store
    const sessionId = await SessionStore.create(user.id, email, user.role);
    
    // Clean up the OTP after successful verification
    await SupabaseEmailOTPStore.delete(email);

    // Set session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verified: true,
      user: {
        id: user.id,
        email: user.email,
        verified: user.verified,
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