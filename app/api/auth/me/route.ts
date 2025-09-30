import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-middleware';
import { RBAC } from '@/lib/rbac';

export async function GET(request: NextRequest) {
  try {
    const authSession = await getCurrentUser(request);
    const user = authSession?.user;
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get user permissions for frontend use
    const permissions = RBAC.getUserPermissions(user);
    const canAccessAdmin = RBAC.canAccessAdmin(user);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
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
    console.error('Error getting user info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}