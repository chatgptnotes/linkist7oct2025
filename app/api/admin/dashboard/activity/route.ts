import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Get recent orders with customer info
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('id, customer_name, email, pricing, status, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get recent customers (new registrations)
    const { data: recentCustomers } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // Create activity feed combining orders and customers
    const activities = [];

    // Add order activities
    recentOrders?.forEach(order => {
      const pricing = order.pricing as any;
      activities.push({
        id: `order-${order.id}`,
        type: 'order' as const,
        message: `New order from ${order.customer_name || 'Unknown'} for $${(pricing?.total || 0).toFixed(2)}`,
        timestamp: formatTimeAgo(new Date(order.created_at)),
        status: order.status
      });
    });

    // Add customer activities
    recentCustomers?.forEach(customer => {
      const name = `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'New Customer';
      activities.push({
        id: `customer-${customer.id}`,
        type: 'customer' as const,
        message: `New customer registered: ${name}`,
        timestamp: formatTimeAgo(new Date(customer.created_at)),
        status: 'completed'
      });
    });

    // Add some payment activities (mock for now, can be expanded)
    const { data: recentPayments } = await supabase
      .from('orders')
      .select('id, customer_name, pricing, updated_at')
      .eq('status', 'delivered')
      .order('updated_at', { ascending: false })
      .limit(5);

    recentPayments?.forEach(payment => {
      const pricing = payment.pricing as any;
      activities.push({
        id: `payment-${payment.id}`,
        type: 'payment' as const,
        message: `Payment received for order - $${(pricing?.total || 0).toFixed(2)}`,
        timestamp: formatTimeAgo(new Date(payment.updated_at)),
        status: 'completed'
      });
    });

    // Sort activities by timestamp (most recent first)
    activities.sort((a, b) => {
      const timeA = parseTimeAgo(a.timestamp);
      const timeB = parseTimeAgo(b.timestamp);
      return timeA - timeB;
    });

    // Return top 15 activities
    return NextResponse.json(activities.slice(0, 15));
  } catch (error) {
    console.error('Error fetching dashboard activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activity' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function parseTimeAgo(timeAgo: string): number {
  if (timeAgo === 'Just now') return 0;
  
  const match = timeAgo.match(/(\d+)\s+(minute|hour|day)s?\s+ago/);
  if (!match) return Date.now(); // Return current time for unparseable strings
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 'minute':
      return value;
    case 'hour':
      return value * 60;
    case 'day':
      return value * 60 * 24;
    default:
      return Date.now();
  }
}