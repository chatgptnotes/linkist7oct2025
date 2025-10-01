import { NextRequest, NextResponse } from 'next/server';

// In-memory user store (shared with register endpoint)
// This will reset on server restart - for development only
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('🔐 Login attempt:', email);

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Find user in memory store
    const user = users.get(normalizedEmail);

    if (!user) {
      console.log('❌ User not found:', normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // In production, use bcrypt to compare hashed passwords
    // For now, direct comparison (INSECURE - replace with bcrypt)
    if (user.password_hash !== password) {
      console.log('❌ Invalid password for:', normalizedEmail);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ User logged in successfully:', normalizedEmail);

    // Create session (in production, use JWT or session tokens)
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone_number,
        role: user.role,
        emailVerified: user.email_verified,
        mobileVerified: user.mobile_verified,
      }
    });

    // Set session cookie
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Export users map so register endpoint can share it
export { users };
