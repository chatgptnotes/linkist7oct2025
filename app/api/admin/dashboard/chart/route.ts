import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7days';
    
    // Calculate date range and intervals
    const now = new Date();
    let startDate = new Date();
    let intervals: { name: string; start: Date; end: Date }[] = [];
    
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        // Create daily intervals for last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(now.getDate() - i);
          const start = new Date(date);
          start.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          
          intervals.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            start,
            end
          });
        }
        break;
        
      case '30days':
        startDate.setDate(now.getDate() - 30);
        // Create weekly intervals for last 30 days
        for (let i = 4; i >= 0; i--) {
          const weekEnd = new Date();
          weekEnd.setDate(now.getDate() - (i * 7));
          const weekStart = new Date(weekEnd);
          weekStart.setDate(weekEnd.getDate() - 6);
          weekStart.setHours(0, 0, 0, 0);
          weekEnd.setHours(23, 59, 59, 999);
          
          intervals.push({
            name: `Week ${5 - i}`,
            start: weekStart,
            end: weekEnd
          });
        }
        break;
        
      case '90days':
        startDate.setDate(now.getDate() - 90);
        // Create monthly intervals for last 3 months
        for (let i = 2; i >= 0; i--) {
          const monthEnd = new Date();
          monthEnd.setMonth(now.getMonth() - i);
          monthEnd.setDate(0); // Last day of previous month
          monthEnd.setHours(23, 59, 59, 999);
          
          const monthStart = new Date();
          monthStart.setMonth(now.getMonth() - i - 1);
          monthStart.setDate(1);
          monthStart.setHours(0, 0, 0, 0);
          
          intervals.push({
            name: monthStart.toLocaleDateString('en-US', { month: 'short' }),
            start: monthStart,
            end: monthEnd
          });
        }
        break;
        
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get data for each interval
    const chartData = await Promise.all(
      intervals.map(async (interval) => {
        // Get orders count for this interval
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', interval.start.toISOString())
          .lte('created_at', interval.end.toISOString());

        // Get revenue for this interval
        const { data: revenueData } = await supabase
          .from('orders')
          .select('pricing')
          .gte('created_at', interval.start.toISOString())
          .lte('created_at', interval.end.toISOString())
          .neq('status', 'cancelled');

        const revenue = revenueData?.reduce((sum, order) => {
          const pricing = order.pricing as any;
          return sum + (pricing?.total || 0);
        }, 0) || 0;

        return {
          name: interval.name,
          orders: ordersCount || 0,
          revenue: revenue
        };
      })
    );

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching dashboard chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard chart data' },
      { status: 500 }
    );
  }
}