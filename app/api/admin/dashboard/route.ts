/**
 * Admin API: Dashboard Metrics
 * All metrics are calculated from Supabase data
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/supabase/admin-client';

// GET /api/admin/dashboard - Get dashboard metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'today';

    // Get cached or fresh metrics from Supabase
    const metrics = await adminDb.getDashboardMetrics(period);

    // Get recent activities
    const activities = await adminDb.getAdminActivityLogs();

    // Get revenue reports
    const { data: revenueData } = await adminDb.supabase
      .from('revenue_reports')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);

    // Get order status distribution
    const { data: orderStats } = await adminDb.supabase
      .from('orders')
      .select('status')
      .then(({ data }) => {
        const stats: any = {};
        data?.forEach((order: any) => {
          stats[order.status] = (stats[order.status] || 0) + 1;
        });
        return { data: stats };
      });

    // Get user growth
    const { data: userGrowth } = await adminDb.supabase
      .from('users')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at');

    // Get top products
    const { data: topProducts } = await adminDb.supabase
      .from('order_items')
      .select('product_name, product_id')
      .then(({ data }) => {
        const productCounts: any = {};
        data?.forEach((item: any) => {
          const key = `${item.product_id}:${item.product_name}`;
          productCounts[key] = (productCounts[key] || 0) + 1;
        });

        return {
          data: Object.entries(productCounts)
            .map(([key, count]) => {
              const [id, name] = key.split(':');
              return { product_id: id, product_name: name, count };
            })
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 10)
        };
      });

    // Get support ticket stats
    const { data: ticketStats } = await adminDb.supabase
      .from('support_tickets')
      .select('status, priority')
      .then(({ data }) => {
        return {
          data: {
            open: data?.filter((t: any) => t.status === 'open').length || 0,
            in_progress: data?.filter((t: any) => t.status === 'in_progress').length || 0,
            urgent: data?.filter((t: any) => t.priority === 'urgent').length || 0,
            high: data?.filter((t: any) => t.priority === 'high').length || 0
          }
        };
      });

    // Compile dashboard data
    const dashboardData = {
      metrics,
      revenue: revenueData,
      orderStats,
      userGrowth,
      topProducts,
      ticketStats,
      recentActivities: activities.slice(0, 20)
    };

    // Log dashboard view
    await adminDb.logAdminActivity({
      action: 'view_dashboard',
      entity_type: 'dashboard',
      details: { period }
    });

    return NextResponse.json({
      success: true,
      data: dashboardData,
      period,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}

// POST /api/admin/dashboard/refresh - Force refresh metrics
export async function POST(request: NextRequest) {
  try {
    // Refresh materialized view
    await adminDb.supabase.rpc('refresh_revenue_reports');

    // Clear metrics cache
    await adminDb.supabase
      .from('dashboard_metrics')
      .delete()
      .gte('calculated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    // Recalculate all periods
    const periods = ['today', 'week', 'month', 'year'];
    const refreshedMetrics: any = {};

    for (const period of periods) {
      refreshedMetrics[period] = await adminDb.getDashboardMetrics(period);
    }

    // Log refresh action
    await adminDb.logAdminActivity({
      action: 'refresh_dashboard',
      entity_type: 'dashboard',
      details: { periods }
    });

    return NextResponse.json({
      success: true,
      message: 'Dashboard metrics refreshed successfully',
      data: refreshedMetrics
    });
  } catch (error) {
    console.error('Error refreshing dashboard metrics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh dashboard metrics' },
      { status: 500 }
    );
  }
}