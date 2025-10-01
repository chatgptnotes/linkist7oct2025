import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In production, this should store the PIN in your database
// For now, we'll use a simple in-memory storage (replace with database)
const userPins = new Map<string, string>();

// Simple hash function using Node.js crypto
function hashPin(pin: string): string {
  return crypto.createHash('sha256').update(pin).digest('hex');
}

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

    // Get user email from session/cookie
    // In production, get this from your auth system
    const userEmail = request.cookies.get('userEmail')?.value ||
                      request.headers.get('x-user-email') ||
                      'guest@example.com'; // Fallback for development

    // Hash the PIN before storing (security best practice)
    const hashedPin = hashPin(pin);

    // Store the hashed PIN (in production, save to database)
    userPins.set(userEmail, hashedPin);

    console.log(`PIN set for user: ${userEmail}`);

    return NextResponse.json({
      success: true,
      message: 'PIN set successfully',
    });

  } catch (error) {
    console.error('Set PIN error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to set PIN' },
      { status: 500 }
    );
  }
}

// Verify PIN endpoint
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

    // Get user email
    const userEmail = request.cookies.get('userEmail')?.value ||
                      request.headers.get('x-user-email') ||
                      'guest@example.com';

    // Get stored hashed PIN
    const hashedPin = userPins.get(userEmail);

    if (!hashedPin) {
      return NextResponse.json(
        { success: false, error: 'No PIN set for this user' },
        { status: 404 }
      );
    }

    // Verify PIN
    const inputHashedPin = hashPin(pin);
    const isValid = inputHashedPin === hashedPin;

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect PIN' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'PIN verified successfully',
    });

  } catch (error) {
    console.error('Verify PIN error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify PIN' },
      { status: 500 }
    );
  }
}
