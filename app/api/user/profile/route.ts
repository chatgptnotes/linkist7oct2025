import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authSession = await getCurrentUser(request);

    if (!authSession.isAuthenticated || !authSession.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, country, mobile, onboarded } = body;
    const email = authSession.user.email;

    // For now, we'll just store the data locally and mark the user as onboarded
    // In a production app, you would save this to your database
    console.log('✅ Profile data received for:', email, {
      firstName,
      lastName,
      country,
      mobile,
      onboarded
    });

    // Return success response
    // The actual data storage is handled client-side for now
    return NextResponse.json({
      success: true,
      profile: {
        email,
        firstName,
        lastName,
        country,
        mobile,
        onboarded: true
      }
    });

  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authSession = await getCurrentUser(request);

    if (!authSession.isAuthenticated || !authSession.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const email = authSession.user.email;

    // For now, return basic profile data
    // In a production app, you would fetch this from your database
    return NextResponse.json({
      success: true,
      profile: {
        email,
        firstName: '',
        lastName: '',
        country: '',
        mobile: '',
        onboarded: false
      }
    });

  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}