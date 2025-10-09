import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import { SupabasePaymentStore } from '@/lib/supabase-payment-store';
import { requireAdmin } from '@/lib/auth-middleware';

export const GET = requireAdmin(
  async function GET(request: NextRequest) {
    try {
      console.log('🔍 Admin orders API: Starting to fetch orders...');
      const orders = await SupabaseOrderStore.getAll();

      console.log(`📊 Admin orders API: Found ${orders.length} orders in database`);

      // Fetch payment data for each order
      console.log('💳 Admin orders API: Fetching payment data for orders...');
      const ordersWithPayments = await Promise.all(
        orders.map(async (order) => {
          try {
            const payments = await SupabasePaymentStore.getByOrderId(order.id);
            return {
              ...order,
              payment: payments.length > 0 ? payments[0] : null, // Get the first (latest) payment
            };
          } catch (error) {
            console.error(`❌ Error fetching payment for order ${order.id}:`, error);
            return {
              ...order,
              payment: null,
            };
          }
        })
      );

      console.log(`✅ Admin orders API: Fetched payment data for ${ordersWithPayments.length} orders`);

      return NextResponse.json({
        success: true,
        orders: ordersWithPayments,
        count: ordersWithPayments.length
      });
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }
  }
);

export const POST = requireAdmin(
  async function POST(request: NextRequest) {
    try {
      const body = await request.json();

      // If userId not provided, create/update user from order data
      let userId = body.userId;
      if (!userId && body.email) {
        console.log('👤 Admin orders API: Creating/updating user...');
        const user = await SupabaseUserStore.upsertByEmail({
          email: body.email,
          first_name: body.cardConfig?.firstName || body.customerName?.split(' ')[0] || null,
          last_name: body.cardConfig?.lastName || body.customerName?.split(' ').slice(1).join(' ') || null,
          phone_number: body.phoneNumber || null,
          email_verified: true,
          mobile_verified: !!body.phoneNumber,
        });
        userId = user.id;
        console.log('✅ Admin orders API: User created/updated:', userId);
      }

      // Create a new order with userId
      const order = await SupabaseOrderStore.create({
        ...body,
        userId
      });
      
      return NextResponse.json({
        success: true,
        order: order
      });
    } catch (error) {
      console.error('Error creating order:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }
  }
);