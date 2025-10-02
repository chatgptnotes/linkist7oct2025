import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { getAuthenticatedUser } from '@/lib/auth-middleware';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Hash PIN using bcrypt for better security
async function hashPin(pin: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pin, salt);
}

// Verify PIN against hash
async function verifyPin(pin: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pin, hash);
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await getAuthenticatedUser(request);

    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pin } = body;

    // Validate PIN
    if (!pin || !/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: 'PIN must be exactly 6 digits' },
        { status: 400 }
      );
    }

    // Hash the PIN before storing (security best practice)
    const hashedPin = await hashPin(pin);

    // Update user's PIN in database
    const { error: updateError } = await supabase
      .from('users')
      .update({
        pin_hash: hashedPin,
        pin_set_at: new Date().toISOString()
      })
      .eq('id', authResult.user.id);

    if (updateError) {
      console.error('Database error setting PIN:', updateError);
      throw new Error('Failed to save PIN to database');
    }

    console.log(`✅ PIN set successfully for user: ${authResult.user.email}`);

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

// Verify PIN endpoint
export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const authResult = await getAuthenticatedUser(request);

    if (!authResult.isAuthenticated || !authResult.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pin } = body;

    if (!pin || !/^\d{6}$/.test(pin)) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN format' },
        { status: 400 }
      );
    }

    // Get user's PIN hash from database
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('pin_hash')
      .eq('id', authResult.user.id)
      .single();

    if (fetchError || !userData) {
      console.error('Database error fetching PIN:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user data' },
        { status: 500 }
      );
    }

    if (!userData.pin_hash) {
      return NextResponse.json(
        { success: false, error: 'No PIN set for this user' },
        { status: 404 }
      );
    }

    // Verify PIN
    const isValid = await verifyPin(pin, userData.pin_hash);

    if (!isValid) {
      console.log(`❌ Invalid PIN attempt for user: ${authResult.user.email}`);
      return NextResponse.json(
        { success: false, error: 'Incorrect PIN' },
        { status: 401 }
      );
    }

    console.log(`✅ PIN verified successfully for user: ${authResult.user.email}`);

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
