import { NextRequest, NextResponse } from 'next/server';
import { SessionStore } from '@/lib/session-store';

export async function POST(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value;

    if (sessionId) {
      // Delete session from database
      const deleted = await SessionStore.delete(sessionId);
      if (deleted) {
        console.log('✅ Session deleted from database:', sessionId);
      } else {
        console.error('❌ Failed to delete session from database');
      }
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