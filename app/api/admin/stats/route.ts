import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { requirePermission, Permission } from '@/lib/rbac';

export const GET = requirePermission(Permission.VIEW_STATS)(
  async function GET(request: NextRequest) {
    try {
      const stats = await SupabaseOrderStore.getStats();
      
      return NextResponse.json({
        success: true,
        stats: stats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }
  }
);