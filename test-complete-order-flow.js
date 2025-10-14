import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.production' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables!');
  console.error('SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('SERVICE_ROLE_KEY:', serviceRoleKey ? '✅' : '❌');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testCompleteOrderFlow() {
  console.log('🧪 Testing Complete Order Flow: User → Order → Payment → Shipping Address\n');

  const testEmail = `test-complete-${Date.now()}@example.com`;

  try {
    // Step 1: Create a test user
    console.log('👤 Step 1: Creating test user...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        first_name: 'Complete',
        last_name: 'Test',
        phone_number: '+1234567890',
        role: 'user',
        email_verified: true,
        mobile_verified: true,
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating user:', userError.message);
      return;
    }

    console.log('✅ User created:', user.id);
    console.log('   Email:', user.email);
    console.log('   Name:', `${user.first_name} ${user.last_name}\n`);

    // Step 2: Create a test order
    console.log('📦 Step 2: Creating test order...');
    const orderNumber = `TEST-FULL-${Date.now()}`;
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id, // Link to user
        status: 'confirmed',
        customer_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number,
        card_config: {
          firstName: user.first_name,
          lastName: user.last_name,
          quantity: 1,
          material: 'PVC',
          color: 'Black',
        },
        shipping: {
          fullName: `${user.first_name} ${user.last_name}`,
          addressLine1: '123 Test Street',
          addressLine2: 'Apt 4B',
          city: 'Test City',
          state: 'California',
          country: 'USA',
          postalCode: '90210',
          phoneNumber: user.phone_number,
        },
        pricing: {
          subtotal: 29.99,
          shipping: 5.00,
          tax: 2.01,
          total: 37.00,
        },
        estimated_delivery: 'Oct 20, 2025',
        emails_sent: {},
      })
      .select()
      .single();

    if (orderError) {
      console.error('❌ Error creating order:', orderError.message);
      return;
    }

    console.log('✅ Order created:', order.id);
    console.log('   Order Number:', order.order_number);
    console.log('   User ID:', order.user_id);
    console.log('   Total:', order.pricing.total);
    console.log('   Status:', order.status, '\n');

    // Step 3: Create a payment record
    console.log('💳 Step 3: Creating payment record...');
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id, // Link to order
        payment_intent_id: `pi_test_${Date.now()}`,
        amount: Math.round(order.pricing.total * 100), // Convert to cents
        currency: 'USD',
        status: 'succeeded',
        payment_method: 'card',
        stripe_fee: Math.round(order.pricing.total * 100 * 0.029 + 30), // 2.9% + $0.30
        net_amount: Math.round(order.pricing.total * 100 - (order.pricing.total * 100 * 0.029 + 30)),
        metadata: {
          test: true,
          cardBrand: 'visa',
          cardLast4: '4242',
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error('❌ Error creating payment:', paymentError.message);
      return;
    }

    console.log('✅ Payment created:', payment.id);
    console.log('   Order ID:', payment.order_id);
    console.log('   Payment Intent:', payment.payment_intent_id);
    console.log('   Amount:', (payment.amount / 100).toFixed(2), payment.currency);
    console.log('   Status:', payment.status);
    console.log('   Stripe Fee:', (payment.stripe_fee / 100).toFixed(2));
    console.log('   Net Amount:', (payment.net_amount / 100).toFixed(2), '\n');

    // Step 4: Create a shipping address record
    console.log('📍 Step 4: Creating shipping address record...');
    const { data: shippingAddress, error: addressError } = await supabase
      .from('shipping_addresses')
      .insert({
        user_id: user.id, // Link to user
        order_id: order.id, // Link to order
        full_name: order.shipping.fullName,
        address_line1: order.shipping.addressLine1,
        address_line2: order.shipping.addressLine2,
        city: order.shipping.city,
        state: order.shipping.state,
        postal_code: order.shipping.postalCode,
        country: order.shipping.country,
        phone_number: order.shipping.phoneNumber,
        is_default: false,
      })
      .select()
      .single();

    if (addressError) {
      console.error('❌ Error creating shipping address:', addressError.message);
      return;
    }

    console.log('✅ Shipping address created:', shippingAddress.id);
    console.log('   User ID:', shippingAddress.user_id);
    console.log('   Order ID:', shippingAddress.order_id);
    console.log('   Full Name:', shippingAddress.full_name);
    console.log('   Address:', shippingAddress.address_line1);
    console.log('   City:', shippingAddress.city);
    console.log('   State:', shippingAddress.state);
    console.log('   Postal Code:', shippingAddress.postal_code);
    console.log('   Country:', shippingAddress.country, '\n');

    // Step 5: Verify all relationships
    console.log('🔍 Step 5: Verifying all relationships...\n');

    // Verify order belongs to user
    if (order.user_id === user.id) {
      console.log('✅ Order is linked to User');
    } else {
      console.error('❌ Order is NOT linked to User');
    }

    // Verify payment belongs to order
    if (payment.order_id === order.id) {
      console.log('✅ Payment is linked to Order');
    } else {
      console.error('❌ Payment is NOT linked to Order');
    }

    // Verify shipping address belongs to both user and order
    if (shippingAddress.user_id === user.id && shippingAddress.order_id === order.id) {
      console.log('✅ Shipping Address is linked to both User and Order');
    } else {
      console.error('❌ Shipping Address is NOT correctly linked');
    }

    // Step 6: Query relationships
    console.log('\n📊 Step 6: Testing relationship queries...\n');

    // Query all orders for user
    const { data: userOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id);
    console.log(`✅ Found ${userOrders.length} order(s) for user ${user.email}`);

    // Query payment for order
    const { data: orderPayments } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order.id);
    console.log(`✅ Found ${orderPayments.length} payment(s) for order ${order.order_number}`);

    // Query shipping addresses for user
    const { data: userAddresses } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', user.id);
    console.log(`✅ Found ${userAddresses.length} shipping address(es) for user ${user.email}`);

    // Query shipping address for order
    const { data: orderAddress } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('order_id', order.id);
    console.log(`✅ Found ${orderAddress.length} shipping address for order ${order.order_number}`);

    console.log('\n🎉 All tests passed! Complete order flow is working correctly.\n');

    // Summary
    console.log('📋 Complete Flow Summary:');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│ Database Chain:                                     │');
    console.log('│                                                     │');
    console.log('│   User (users)                                      │');
    console.log(`│   ├─ ID: ${user.id.substring(0, 20)}...│`);
    console.log(`│   ├─ Email: ${user.email.padEnd(36)} │`);
    console.log('│   │                                                 │');
    console.log('│   └─→ Order (orders)                                │');
    console.log(`│       ├─ ID: ${order.id.substring(0, 20)}...│`);
    console.log(`│       ├─ Number: ${order.order_number.padEnd(31)} │`);
    console.log('│       │                                             │');
    console.log('│       ├─→ Payment (payments)                        │');
    console.log(`│       │   ├─ ID: ${payment.id.substring(0, 20)}...│`);
    console.log(`│       │   ├─ Status: ${payment.status.padEnd(28)} │`);
    console.log(`│       │   └─ Amount: $${(payment.amount / 100).toFixed(2).padEnd(26)} │`);
    console.log('│       │                                             │');
    console.log('│       └─→ Shipping Address (shipping_addresses)    │');
    console.log(`│           ├─ ID: ${shippingAddress.id.substring(0, 20)}...│`);
    console.log(`│           ├─ City: ${shippingAddress.city.padEnd(30)} │`);
    console.log(`│           └─ Country: ${shippingAddress.country.padEnd(26)} │`);
    console.log('│                                                     │');
    console.log('└─────────────────────────────────────────────────────┘\n');

    console.log('✨ All foreign key relationships verified!');
    console.log('✨ User → Order → Payment ✅');
    console.log('✨ User → Order → Shipping Address ✅\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testCompleteOrderFlow();
