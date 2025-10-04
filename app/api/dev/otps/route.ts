import { NextResponse } from 'next/server';
import { SupabaseEmailOTPStore, SupabaseMobileOTPStore } from '@/lib/supabase-otp-store';

// Development only - View all active OTPs
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const emailOtps = await SupabaseEmailOTPStore.getAllForDev();
    const mobileOtps = await SupabaseMobileOTPStore.getAllForDev();

    const now = new Date();

    return NextResponse.json({
      timestamp: now.toISOString(),
      emailOTPs: emailOtps.map(record => ({
        email: record.email,
        otp: record.otp,
        expiresAt: record.expires_at,
        expired: new Date(record.expires_at) < now,
        verified: record.verified
      })),
      mobileOTPs: mobileOtps.map(record => ({
        mobile: record.mobile,
        otp: record.otp,
        expiresAt: record.expires_at,
        expired: new Date(record.expires_at) < now,
        verified: record.verified
      }))
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching OTPs:', error);
    return NextResponse.json({ error: 'Failed to fetch OTPs' }, { status: 500 });
  }
}
