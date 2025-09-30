import { NextRequest, NextResponse } from 'next/server';
import { UserStore } from '@/lib/user-store';

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value;
    
    if (sessionId) {
      // Delete session from store
      UserStore.deleteSession(sessionId);
    }

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.cookies.delete('session');

    return response;

  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}