import { NextRequest, NextResponse } from 'next/server';
import { SupabaseOrderStore } from '@/lib/supabase-order-store';
import { SupabaseUserStore } from '@/lib/supabase-user-store';
import { generateOrderNumber } from '@/lib/order-store';

export async function GET(request: NextRequest) {
  console.log('🧪 [test-order-creation] Test endpoint called');

  try {
    // First, create/update test user
    console.log('👤 [test-order-creation] Creating test user...');
    const testUser = await SupabaseUserStore.upsertByEmail({
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'Customer',
      phone_number: '+1234567890',
      email_verified: true,
      mobile_verified: true,
    });
    console.log('✅ [test-order-creation] Test user created:', testUser.id);

    // Create a test order with minimal data
    const testOrder = {
      orderNumber: generateOrderNumber(),
      status: 'confirmed' as const,
      customerName: 'Test Customer',
      email: 'test@example.com',
      phoneNumber: '+1234567890',
      cardConfig: {
        firstName: 'Test',
        lastName: 'User',
        title: 'Software Developer',
        quantity: 1
      },
      pricing: {
        subtotal: 29.99,
        shipping: 5.00,
        tax: 2.02,
        total: 36.01,
      },
      shipping: {
        fullName: 'Test Customer',
        addressLine1: '123 Test St',
        addressLine2: '',
        city: 'Test City',
        state: 'CA',
        country: 'United States',
        postalCode: '12345',
        phoneNumber: '+1234567890',
      },
      estimatedDelivery: 'Dec 15, 2025',
      emailsSent: {},
    };

    console.log('🧪 [test-order-creation] Attempting to create test order:', testOrder);

    const createdOrder = await SupabaseOrderStore.create(testOrder);

    console.log('✅ [test-order-creation] Test order created successfully:', createdOrder);

    // Try to retrieve the order
    const retrievedOrder = await SupabaseOrderStore.getById(createdOrder.id);
    console.log('🔍 [test-order-creation] Retrieved order:', retrievedOrder);

    // Get all orders to verify
    const allOrders = await SupabaseOrderStore.getAll();
    console.log('📊 [test-order-creation] Total orders in database:', allOrders.length);

    // Get all users to verify
    const allUsers = await SupabaseUserStore.getAll();
    console.log('📊 [test-order-creation] Total users in database:', allUsers.length);

    return NextResponse.json({
      success: true,
      message: 'Test order and user created successfully!',
      testUser,
      createdOrder,
      retrievedOrder,
      totalOrders: allOrders.length,
      totalUsers: allUsers.length,
      allOrders: allOrders.slice(0, 5), // Return first 5 orders
      allUsers: allUsers.slice(0, 5) // Return first 5 users
    });

  } catch (error) {
    console.error('❌ [test-order-creation] Test failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create test order',
      details: error
    }, { status: 500 });
  }
}

// POST endpoint to test with custom data
export async function POST(request: NextRequest) {
  console.log('🧪 [test-order-creation] POST test endpoint called');

  try {
    const body = await request.json();
    console.log('📦 [test-order-creation] Request body:', body);

    const testOrder = {
      orderNumber: generateOrderNumber(),
      status: body.status || 'confirmed' as const,
      customerName: body.customerName || 'Test Customer',
      email: body.email || 'test@example.com',
      phoneNumber: body.phoneNumber || '+1234567890',
      cardConfig: body.cardConfig || {
        firstName: 'Test',
        lastName: 'User',
        quantity: 1
      },
      pricing: body.pricing || {
        subtotal: 29.99,
        shipping: 5.00,
        tax: 2.02,
        total: 36.01,
      },
      shipping: body.shipping || {
        fullName: 'Test Customer',
        addressLine1: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'United States',
        postalCode: '12345',
      },
      estimatedDelivery: body.estimatedDelivery || 'Dec 15, 2025',
      emailsSent: {},
    };

    console.log('🧪 [test-order-creation] Creating order with data:', testOrder);

    const createdOrder = await SupabaseOrderStore.create(testOrder);

    console.log('✅ [test-order-creation] Order created:', createdOrder);

    return NextResponse.json({
      success: true,
      message: 'Test order created successfully!',
      order: createdOrder
    });

  } catch (error) {
    console.error('❌ [test-order-creation] Test failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      fullError: error
    });

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create test order',
      details: error
    }, { status: 500 });
  }
}
