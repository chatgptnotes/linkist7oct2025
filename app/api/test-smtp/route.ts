import { NextResponse } from 'next/server';
import { verifySMTPConnection } from '@/lib/smtp-email-service';

export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'Not available in production' },
      { status: 403 }
    );
  }

  console.log('🧪 Testing SMTP connection...');
  console.log('Environment variables:', {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS ? '***SET***' : 'NOT SET',
    SMTP_PASS_LENGTH: process.env.SMTP_PASS?.length || 0
  });

  const isConnected = await verifySMTPConnection();

  return NextResponse.json({
    success: isConnected,
    message: isConnected
      ? 'SMTP connection verified successfully'
      : 'SMTP connection failed - check server logs for details',
    config: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER,
      hasPassword: Boolean(process.env.SMTP_PASS),
      passwordLength: process.env.SMTP_PASS?.length || 0
    }
  });
}
