#!/usr/bin/env node

/**
 * Test script to verify user_id is properly saved in orders table
 *
 * This script:
 * 1. Creates a test user
 * 2. Creates a test order linked to that user
 * 3. Verifies the user_id is saved in the orders table
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.production');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testUserOrderLink() {
  console.log('\n🧪 Starting user-order link test...\n');

  try {
    // Step 1: Create a test user
    console.log('1️⃣ Creating test user...');
    const testEmail = `test-${Date.now()}@linkist.test`;

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        first_name: 'Test',
        last_name: 'User',
        phone_number: '+1234567890',
        role: 'user',
        email_verified: true,
        mobile_verified: true,
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Failed to create user:', userError);
      return;
    }

    console.log('✅ User created successfully');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.email);

    // Step 2: Create a test order linked to the user
    console.log('\n2️⃣ Creating test order linked to user...');

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: `TEST-${Date.now()}`,
        user_id: user.id, // Link to user
        status: 'pending',
        customer_name: 'Test User',
        email: testEmail,
        phone_number: '+1234567890',
        card_config: { firstName: 'Test', lastName: 'User', quantity: 1 },
        shipping: {
          fullName: 'Test User',
          addressLine1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          country: 'Test Country',
          postalCode: '12345',
          phoneNumber: '+1234567890'
        },
        pricing: {
          subtotal: 29.99,
          shipping: 5.00,
          tax: 1.75,
          total: 36.74
        },
        emails_sent: {}
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Failed to create order:', orderError);
      return;
    }

    console.log('✅ Order created successfully');
    console.log('   Order ID:', order.id);
    console.log('   Order Number:', order.order_number);
    console.log('   User ID:', order.user_id);

    // Step 3: Verify the user_id is saved
    console.log('\n3️⃣ Verifying user_id in orders table...');

    const { data: verifyOrder, error: verifyError } = await supabase
      .from('orders')
      .select('id, order_number, user_id, email')
      .eq('id', order.id)
      .single();

    if (verifyError) {
      console.error('❌ Failed to verify order:', verifyError);
      return;
    }

    if (verifyOrder.user_id === user.id) {
      console.log('✅ SUCCESS! user_id is correctly saved in orders table');
      console.log('   Order ID:', verifyOrder.id);
      console.log('   User ID:', verifyOrder.user_id);
      console.log('   Match:', verifyOrder.user_id === user.id ? '✓' : '✗');
    } else {
      console.error('❌ FAILED! user_id does not match');
      console.error('   Expected:', user.id);
      console.error('   Got:', verifyOrder.user_id);
    }

    // Step 4: Test the foreign key relationship
    console.log('\n4️⃣ Testing foreign key relationship...');

    const { data: joinedData, error: joinError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        users!inner (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', order.id)
      .single();

    if (joinError) {
      console.error('❌ Failed to join orders with users:', joinError);
    } else {
      console.log('✅ Foreign key relationship working correctly');
      console.log('   Order Number:', joinedData.order_number);
      console.log('   User Email:', joinedData.users.email);
      console.log('   User Name:', `${joinedData.users.first_name} ${joinedData.users.last_name}`);
    }

    // Cleanup: Delete test data
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('orders').delete().eq('id', order.id);
    await supabase.from('users').delete().eq('id', user.id);
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! user_id linking is working correctly.\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Run the test
testUserOrderLink();
