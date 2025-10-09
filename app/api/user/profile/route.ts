import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-middleware';
import { SupabaseUserStore } from '@/lib/supabase-user-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, country, mobile, onboarded } = body;

    // Check if email is provided (required for non-authenticated users)
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Optional: Check if user is authenticated and use their email
    const authSession = await getCurrentUser(request);
    const userEmail = authSession.isAuthenticated && authSession.user
      ? authSession.user.email
      : email;

    console.log('👤 Saving profile data for:', userEmail, {
      firstName,
      lastName,
      country,
      mobile,
      onboarded
    });

    // Save user data to database using SupabaseUserStore
    try {
      const user = await SupabaseUserStore.upsertByEmail({
        email: userEmail,
        first_name: firstName || null,
        last_name: lastName || null,
        phone_number: mobile || null,
        role: 'user'
      });

      console.log('✅ Profile saved successfully to database:', user.id);

      return NextResponse.json({
        success: true,
        profile: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          country,
          mobile: user.phone_number,
          onboarded: true
        }
      });
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save profile data' },
        { status: 500 }
      );
    }

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