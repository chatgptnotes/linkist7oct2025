import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in development or with special key
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev) {
    return NextResponse.json(
      { error: 'Not available' },
      { status: 403 }
    );
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    hasSmtpHost: Boolean(process.env.SMTP_HOST),
    hasSmtpPort: Boolean(process.env.SMTP_PORT),
    hasSmtpUser: Boolean(process.env.SMTP_USER),
    hasSmtpPass: Boolean(process.env.SMTP_PASS),
    hasEmailFrom: Boolean(process.env.EMAIL_FROM),
    smtpHost: process.env.SMTP_HOST || 'NOT SET',
    smtpPort: process.env.SMTP_PORT || 'NOT SET',
    smtpUser: process.env.SMTP_USER || 'NOT SET',
    emailFrom: process.env.EMAIL_FROM || 'NOT SET',
    smtpPassLength: process.env.SMTP_PASS?.length || 0,
  });
}
