import { NextRequest, NextResponse } from 'next/server';

// In-memory user store (replace with database in production)
// This will reset on server restart - for development only
const users = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, password } = body;

    console.log('📝 Registration attempt:', { firstName, lastName, email, phone });

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    if (users.has(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Create user object
    const user = {
      id: `user_${Date.now()}`,
      email: normalizedEmail,
      first_name: firstName,
      last_name: lastName,
      phone_number: phone || null,
      password_hash: password, // In production, hash this with bcrypt
      role: 'user',
      email_verified: false,
      mobile_verified: false,
      created_at: new Date().toISOString(),
    };

    // Store user in memory
    users.set(normalizedEmail, user);

    console.log('✅ User registered successfully:', normalizedEmail);
    console.log('📊 Total users:', users.size);

    // Return success with user data
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone_number,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Export users map for login endpoint to access
export { users };
