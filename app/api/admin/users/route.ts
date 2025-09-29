import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-middleware';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const GET = requireAdmin(
  async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const role = searchParams.get('role');
      const status = searchParams.get('status');
      const search = searchParams.get('search');

      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (role) {
        query = query.eq('role', role);
      }
      
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data: users, error } = await query;

      if (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
          { error: 'Failed to fetch users' },
          { status: 500 }
        );
      }

      // Transform data to match expected format
      const transformedUsers = users?.map(user => ({
        id: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name',
        email: user.email,
        phone: user.phone_number,
        role: user.role || 'user',
        status: 'active', // Default status since profiles don't have status field
        lastLogin: null, // Would need separate session tracking
        createdAt: user.created_at,
        permissions: [] // Would need to be calculated based on role
      })) || [];

      return NextResponse.json(transformedUsers);
    } catch (error) {
      console.error('Error in users API:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
  }
);

export const POST = requireAdmin(
  async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, email, phone, role, status, permissions } = body;

      // Split name into first and last name
      const nameParts = name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { data: user, error } = await supabase
        .from('profiles')
        .insert({
          email,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          role: role || 'user'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
          email: user.email,
          phone: user.phone_number,
          role: user.role,
          status: 'active',
          createdAt: user.created_at,
          permissions: []
        }
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }
  }
);