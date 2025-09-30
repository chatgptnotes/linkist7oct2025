import { NextRequest } from 'next/server';
import { UserStore } from '@/lib/user-store';
import { SessionStore } from '@/lib/session-store';

export async function getCurrentUser(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionId = request.cookies.get('session')?.value;
    
    if (!sessionId) {
      return null;
    }

    // Get session from store
    const session = SessionStore.get(sessionId);
    
    if (!session) {
      return null;
    }

    // Get user
    const user = UserStore.getById(session.userId);
    
    if (!user) {
      // Clean up invalid session
      SessionStore.delete(sessionId);
      return null;
    }

    return {
      user,
      session: {
        sessionId,
        userId: session.userId,
        email: session.email,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt
      },
      isAdmin: user.role === 'admin'
    };

  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<Response>) {
  return async (request: NextRequest) => {
    const auth = await getCurrentUser(request);
    
    if (!auth) {
      return Response.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return handler(request, auth.user);
  };
}