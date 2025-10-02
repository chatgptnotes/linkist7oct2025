import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SupabaseEmailOTPStore, generateEmailOTP, cleanExpiredOTPs, type EmailOTPRecord } from '@/lib/supabase-otp-store';

export async function POST(request: NextRequest) {
  // Initialize Resend only when needed to avoid build errors
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'dummy_key_for_demo') {
    return NextResponse.json(
      { error: 'Email service not configured' }, 
      { status: 503 }
    );
  }
  const resend = new Resend(apiKey);
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

    // Send actual email using Resend
    try {
      if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_your_resend_api_key_here') {
        const { data, error } = await resend.emails.send({
          from: process.env.EMAIL_FROM || 'Linkist <onboarding@resend.dev>',
          to: [email],
          subject: 'Your Linkist Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #e53e3e;">Verify Your Email</h2>
              <p>Your Linkist verification code is:</p>
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #0f172a; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
              </div>
              <p style="color: #64748b;">This code will expire in 10 minutes.</p>
              <p style="color: #64748b;">If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        });

        if (error) {
          console.error('Email sending error:', error);
          throw error;
        }

        console.log(`✅ Email sent successfully to ${email}:`, data?.id);
      } else {
        // Fallback to console logging for development/missing API key
        console.log(`📧 OTP for ${email}: ${otp} (expires in 10 minutes)`);
        console.log('⚠️  Set RESEND_API_KEY in .env.local to send real emails');
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue execution - we'll still store the OTP for verification
      // In production, you might want to return an error here
      console.log(`📧 Fallback - OTP for ${email}: ${otp} (expires in 10 minutes)`);
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      // 🚨 TEMPORARY: Always show OTP until email is configured properly
      // TODO: Remove once Resend email delivery is verified
      devOtp: otp,
      emailSent: process.env.RESEND_API_KEY ? true : false
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