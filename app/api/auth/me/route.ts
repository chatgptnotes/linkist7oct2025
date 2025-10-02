import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-middleware';
import { RBAC } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const authSession = await getCurrentUser(request);

    console.log('🔍 /api/auth/me - authSession:', authSession);

    if (!authSession.isAuthenticated || !authSession.user) {
      console.log('❌ /api/auth/me - Not authenticated');
      return NextResponse.json(
        { error: 'Not authenticated', isAuthenticated: false },
        { status: 401 }
      );
    }

    const user = authSession.user;

    // Get user permissions for frontend use
    const permissions = RBAC.getUserPermissions(user);
    const canAccessAdmin = RBAC.canAccessAdmin(user);

    console.log('✅ /api/auth/me - User authenticated:', user.email);

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        email_verified: user.email_verified,
        mobile_verified: user.mobile_verified,
        role: user.role,
        created_at: user.created_at
      },
      permissions,
      canAccessAdmin,
      isAdmin: RBAC.isAdmin(user),
      isModerator: RBAC.isModerator(user)
    });

  } catch (error) {
    console.error('❌ /api/auth/me error:', error);
    return NextResponse.json(
      { error: 'Internal server error', isAuthenticated: false },
      { status: 500 }
    );
  }
}