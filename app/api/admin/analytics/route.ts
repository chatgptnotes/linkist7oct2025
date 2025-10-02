import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30days';

    // Calculate date range
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Fetch orders within date range
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      throw ordersError;
    }

    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, created_at');

    if (usersError) {
      console.error('Error fetching users:', usersError);
    }

    // Calculate analytics
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
    const totalOrders = orders?.length || 0;

    // Group orders by status
    const ordersByStatus = orders?.reduce((acc: Record<string, number>, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}) || {};

    // Calculate monthly revenue
    const monthlyData = new Map<string, { revenue: number; orders: number }>();
    orders?.forEach(order => {
      const month = new Date(order.created_at).toLocaleDateString('en-US', { month: 'short' });
      const current = monthlyData.get(month) || { revenue: 0, orders: 0 };
      monthlyData.set(month, {
        revenue: current.revenue + (order.total_amount || 0),
        orders: current.orders + 1
      });
    });

    const monthlyRevenue = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders
    }));

    // Calculate customer metrics
    const totalCustomers = users?.length || 0;
    const newCustomers = users?.filter(u =>
      new Date(u.created_at) >= startDate
    ).length || 0;

    // Top products (mock data for now since we don't have product sales tracking)
    const topProducts = [
      { name: 'NFC Business Card', sales: totalOrders, revenue: totalRevenue }
    ];

    // Geographic data (mock)
    const geographic = [
      { country: 'United States', orders: Math.floor(totalOrders * 0.6), revenue: totalRevenue * 0.6 },
      { country: 'Canada', orders: Math.floor(totalOrders * 0.2), revenue: totalRevenue * 0.2 },
      { country: 'United Kingdom', orders: Math.floor(totalOrders * 0.1), revenue: totalRevenue * 0.1 },
      { country: 'Australia', orders: Math.floor(totalOrders * 0.1), revenue: totalRevenue * 0.1 }
    ];

    const analyticsData = {
      revenue: {
        total: totalRevenue,
        growth: 15.5, // Mock growth percentage
        monthly: monthlyRevenue
      },
      orders: {
        total: totalOrders,
        growth: 12.3, // Mock growth percentage
        byStatus: ordersByStatus,
        trends: []
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
        returning: totalCustomers - newCustomers,
        retention: totalCustomers > 0 ? ((totalCustomers - newCustomers) / totalCustomers * 100) : 0,
        ltv: totalCustomers > 0 ? totalRevenue / totalCustomers : 0
      },
      products: {
        topPerforming: topProducts,
        categories: [
          { name: 'NFC Cards', value: totalOrders }
        ]
      },
      geographic,
      conversion: {
        rate: 3.2, // Mock conversion rate
        funnel: [
          { stage: 'Visitors', count: totalOrders * 30, rate: 100 },
          { stage: 'Product Views', count: totalOrders * 10, rate: 33 },
          { stage: 'Add to Cart', count: totalOrders * 5, rate: 17 },
          { stage: 'Checkout', count: totalOrders * 2, rate: 7 },
          { stage: 'Completed', count: totalOrders, rate: 3.2 }
        ]
      }
    };

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
