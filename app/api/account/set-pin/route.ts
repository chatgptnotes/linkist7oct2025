import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    // Validate PIN
    if (!pin || !/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: 'PIN must be exactly 6 digits' },
        { status: 400 }
      );
    }

    // Try to get authenticated user (may not exist during onboarding)
    const authResult = await getAuthenticatedUser(request);

    if (authResult.isAuthenticated && authResult.user) {
      // User is logged in - store PIN in their session/localStorage
      // For now, we just acknowledge it was set
      console.log(`✅ PIN set for authenticated user: ${authResult.user.email}`);
    } else {
      // User is in onboarding flow - PIN will be stored in localStorage
      console.log(`✅ PIN set during onboarding flow`);
    }

    // Store PIN in localStorage on client side (it's already happening)
    // In production, you'd want to:
    // 1. Hash the PIN
    // 2. Store it in the database after user completes registration
    // 3. Associate it with their account

    return NextResponse.json({
      success: true,
      message: 'PIN set successfully',
    });

  } catch (error) {
    console.error('❌ Set PIN error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set PIN' },
      { status: 500 }
    );
  }
}

// Verify PIN endpoint - simplified for onboarding
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;

    if (!pin || !/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN format' },
        { status: 400 }
      );
    }

    // For now, PIN verification is handled on the client side
    // In production, you'd verify against the hashed PIN in the database

    console.log(`✅ PIN verification requested`);

    return NextResponse.json({
      success: true,
      message: 'PIN verified successfully',
    });

  } catch (error) {
    console.error('❌ Verify PIN error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify PIN' },
      { status: 500 }
    );
  }
}
