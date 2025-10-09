import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import { requireAdmin } from '@/lib/auth-middleware';

// Test endpoint to create real order data and remove mock data
export const POST = requireAdmin(
  async function POST(request: NextRequest) {
    try {
      console.log('🧪 Creating real test order and removing mock data...');

      // First, create/update user
      const user = await SupabaseUserStore.upsertByEmail({
        email: 'tejaswinidhage2023@gmail.com',
        first_name: 'Tejaswini',
        last_name: 'Dhage',
        phone_number: '+91 9172740454',
        email_verified: true,
        mobile_verified: true,
      });

      console.log('✅ User created/updated:', user.id);

      // Create a real test order with actual data
      const realTestOrder = {
        orderNumber: `LNK-${Date.now()}`,
        userId: user.id, // Link to user
        status: 'confirmed' as const,
        customerName: 'Tejaswini Dhage',
        email: 'tejaswinidhage2023@gmail.com',
        phoneNumber: '+91 9172740454',
        cardConfig: {
          firstName: 'Tejaswini',
          lastName: 'Dhage',
          title: 'Digital Marketing Specialist',
          company: 'Tech Solutions Inc',
          quantity: 2
        },
        shipping: {
          fullName: 'Tejaswini Dhage',
          addressLine1: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          postalCode: '400001'
        },
        pricing: {
          subtotal: 58.00,
          shipping: 10.00,
          tax: 5.80,
          total: 73.80
        },
        emailsSent: {},
        estimatedDelivery: 'Feb 15, 2025',
        notes: 'Real customer order - Priority processing'
      };

      // Insert the real test order
      const newOrder = await SupabaseOrderStore.create(realTestOrder);
      
      console.log('✅ Real test order created:', newOrder.id);
      
      return NextResponse.json({
        success: true,
        message: 'Real test order created successfully',
        order: newOrder
      });
      
    } catch (error) {
      console.error('❌ Error creating real test order:', error);
      return NextResponse.json(
        { error: 'Failed to create real test order' },
        { status: 500 }
      );
    }
  }
);

// Clear all orders (for testing)
export const DELETE = requireAdmin(
  async function DELETE(request: NextRequest) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      console.log('🗑️ Clearing all orders from database...');
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (error) {
        throw error;
      }
      
      console.log('✅ All orders cleared from database');
      
      return NextResponse.json({
        success: true,
        message: 'All orders cleared successfully'
      });
      
    } catch (error) {
      console.error('❌ Error clearing orders:', error);
      return NextResponse.json(
        { error: 'Failed to clear orders' },
        { status: 500 }
      );
    }
  }
);