import { NextResponse } from 'next/server';
import { sendOTPEmail } from '@/lib/smtp-email-service';

export async function GET() {
  const startTime = Date.now();

  try {
    console.log('🔍 Testing SMTP in production environment');
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Timestamp:', new Date().toISOString());

    // Check environment variables
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      SMTP_HOST: process.env.SMTP_HOST || 'MISSING',
      SMTP_PORT: process.env.SMTP_PORT || 'MISSING',
      SMTP_USER: process.env.SMTP_USER || 'MISSING',
      SMTP_PASS_LENGTH: process.env.SMTP_PASS?.length || 0,
      EMAIL_FROM: process.env.EMAIL_FROM || 'MISSING',
      EMAIL_REPLY_TO: process.env.EMAIL_REPLY_TO || 'MISSING',
    };

    console.log('Environment variables:', envCheck);

    // Check for missing variables
    const missing = [];
    if (!process.env.SMTP_HOST) missing.push('SMTP_HOST');
    if (!process.env.SMTP_PORT) missing.push('SMTP_PORT');
    if (!process.env.SMTP_USER) missing.push('SMTP_USER');
    if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');

    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missing,
        envCheck,
        executionTime: Date.now() - startTime
      }, { status: 500 });
    }

    // Try to send a test email
    const testEmail = 'test@example.com'; // Won't actually send
    const result = await sendOTPEmail({
      to: testEmail,
      otp: '123456',
      expiresInMinutes: 5
    });

    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: result.success,
      message: result.success ? 'SMTP is working!' : 'SMTP failed',
      error: result.error || null,
      envCheck,
      executionTime,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const executionTime = Date.now() - startTime;
    console.error('❌ SMTP test error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      executionTime,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
