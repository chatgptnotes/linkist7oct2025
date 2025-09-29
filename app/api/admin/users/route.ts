/**
 * Admin API: User Management
 * All user data is stored in Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase/admin-client';

// GET /api/admin/users - Get all users with profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Fetch users from Supabase
    const users = await adminDb.getUsers({
      search,
      limit,
      offset
    });

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'view_users',
      entity_type: 'users',
      details: { search, page, limit }
    });

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: users.length
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.first_name || !data.last_name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create user in Supabase
    const { data: user, error } = await adminDb.supabase
      .from('users')
      .insert({
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email_verified: data.email_verified || false,
        mobile_verified: data.mobile_verified || false
      })
      .select()
      .single();

    if (error) throw error;

    // Create user profile
    if (user) {
      await adminDb.supabase
        .from('user_profiles')
        .insert({
          user_id: user.id,
          company_name: data.company_name,
          job_title: data.job_title,
          bio: data.bio,
          website: data.website,
          social_links: data.social_links || {},
          preferences: data.preferences || {},
          tags: data.tags || [],
          is_vip: data.is_vip || false
        });
    }

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'create_user',
      entity_type: 'users',
      entity_id: user.id,
      details: { email: data.email }
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const userId = data.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Update user in Supabase
    const { data: user, error: userError } = await adminDb.supabase
      .from('users')
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        email_verified: data.email_verified,
        mobile_verified: data.mobile_verified
      })
      .eq('id', userId)
      .select()
      .single();

    if (userError) throw userError;

    // Update user profile
    const { error: profileError } = await adminDb.supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        company_name: data.company_name,
        job_title: data.job_title,
        bio: data.bio,
        website: data.website,
        social_links: data.social_links,
        preferences: data.preferences,
        tags: data.tags,
        is_vip: data.is_vip,
        total_orders: data.total_orders,
        total_spent: data.total_spent,
        lifetime_value: data.lifetime_value
      });

    if (profileError) throw profileError;

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'update_user',
      entity_type: 'users',
      entity_id: userId,
      details: { changes: data }
    });

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Delete user profile first (due to foreign key)
    await adminDb.supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId);

    // Delete user from Supabase
    const { error } = await adminDb.supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) throw error;

    // Log admin activity
    await adminDb.logAdminActivity({
      action: 'delete_user',
      entity_type: 'users',
      entity_id: userId,
      details: {}
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}