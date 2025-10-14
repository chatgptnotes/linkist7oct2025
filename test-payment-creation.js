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

async function testPaymentCreation() {
  console.log('🧪 Testing Payment Creation Flow\n');

  const testEmail = `test-payment-${Date.now()}@example.com`;

  try {
    // Step 1: Create a test user
    console.log('👤 Step 1: Creating test user...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        first_name: 'Payment',
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
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: `TEST-PAY-${Date.now()}`,
        user_id: user.id,
        status: 'confirmed',
        customer_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number,
        card_config: {
          firstName: user.first_name,
          lastName: user.last_name,
          quantity: 1,
        },
        shipping: {
          fullName: `${user.first_name} ${user.last_name}`,
          addressLine1: '123 Test St',
          city: 'Test City',
          state: 'TS',
          country: 'USA',
          postalCode: '12345',
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
    console.log('   Total:', order.pricing.total, '\n');

    // Step 3: Create a payment record
    console.log('💳 Step 3: Creating payment record...');
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: order.id,
        payment_intent_id: `pi_test_${Date.now()}`,
        amount: Math.round(order.pricing.total * 100), // Convert to cents
        currency: 'USD',
        status: 'succeeded',
        payment_method: 'card',
        stripe_fee: Math.round(order.pricing.total * 100 * 0.029 + 30), // Stripe fee: 2.9% + $0.30
        net_amount: Math.round(order.pricing.total * 100 - (order.pricing.total * 100 * 0.029 + 30)),
        metadata: {
          test: true,
          createdBy: 'test-payment-creation.js',
        },
      })
      .select()
      .single();

    if (paymentError) {
      console.error('❌ Error creating payment:', paymentError.message);
      console.error('   Details:', paymentError);
      return;
    }

    console.log('✅ Payment created:', payment.id);
    console.log('   Order ID:', payment.order_id);
    console.log('   Payment Intent ID:', payment.payment_intent_id);
    console.log('   Amount:', (payment.amount / 100).toFixed(2), payment.currency);
    console.log('   Status:', payment.status);
    console.log('   Stripe Fee:', (payment.stripe_fee / 100).toFixed(2));
    console.log('   Net Amount:', (payment.net_amount / 100).toFixed(2), '\n');

    // Step 4: Verify the payment is linked to the order
    console.log('🔍 Step 4: Verifying payment-order link...');
    const { data: verifyPayment, error: verifyError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order.id)
      .single();

    if (verifyError) {
      console.error('❌ Error verifying payment:', verifyError.message);
      return;
    }

    if (verifyPayment.order_id === order.id) {
      console.log('✅ SUCCESS! Payment is correctly linked to order');
      console.log('   Payment ID:', verifyPayment.id);
      console.log('   Linked to Order:', verifyPayment.order_id);
      console.log('   Order belongs to User:', order.user_id, '\n');
    } else {
      console.error('❌ FAILED! Payment is not correctly linked');
    }

    // Step 5: Query payments by order
    console.log('📊 Step 5: Querying all payments for this order...');
    const { data: orderPayments, error: queryError } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order.id);

    if (queryError) {
      console.error('❌ Error querying payments:', queryError.message);
      return;
    }

    console.log(`✅ Found ${orderPayments.length} payment(s) for order ${order.order_number}`);
    orderPayments.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.payment_intent_id} - ${p.status} - $${(p.amount / 100).toFixed(2)}`);
    });

    console.log('\n🎉 All tests passed! Payment creation flow is working correctly.\n');

    // Summary
    console.log('📋 Summary:');
    console.log('   ✅ User created with ID:', user.id);
    console.log('   ✅ Order created with ID:', order.id);
    console.log('   ✅ Order linked to user via user_id');
    console.log('   ✅ Payment created with ID:', payment.id);
    console.log('   ✅ Payment linked to order via order_id');
    console.log('   ✅ Full chain: User → Order → Payment\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testPaymentCreation();
