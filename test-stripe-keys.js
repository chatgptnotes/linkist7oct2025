#!/usr/bin/env node

/**
 * Test Stripe API Keys
 * This script verifies if your Stripe keys are valid
 */

import Stripe from 'stripe';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '.env.local') });

console.log('🔑 Testing Stripe API Keys\n');

// Check if keys are present
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;

console.log('1. Checking environment variables:');
console.log(`   Publishable Key: ${publishableKey ? '✅ Found' : '❌ Missing'}`);
console.log(`   Secret Key: ${secretKey ? '✅ Found' : '❌ Missing'}`);

if (publishableKey) {
  console.log(`   - Starts with: ${publishableKey.substring(0, 10)}...`);
  console.log(`   - Mode: ${publishableKey.includes('test') ? 'Test Mode' : 'Live Mode'}`);
}

if (secretKey) {
  console.log(`   - Starts with: ${secretKey.substring(0, 10)}...`);
  console.log(`   - Mode: ${secretKey.includes('test') ? 'Test Mode' : 'Live Mode'}`);
  console.log(`   - Length: ${secretKey.length} characters`);
}

if (!secretKey) {
  console.log('\n❌ Cannot test API connection without secret key');
  process.exit(1);
}

console.log('\n2. Testing API connection:');

try {
  const stripe = new Stripe(secretKey, {
    apiVersion: '2024-09-30.acacia',
  });

  // Try to retrieve account info to verify the key
  const account = await stripe.accounts.retrieve();

  console.log('   ✅ API Key is valid!');
  console.log(`   - Account ID: ${account.id}`);
  console.log(`   - Country: ${account.country}`);
  console.log(`   - Default Currency: ${account.default_currency}`);

  // Test creating a payment intent
  console.log('\n3. Testing payment intent creation:');
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1000, // $10.00 in cents
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log('   ✅ Payment intent created successfully!');
  console.log(`   - Intent ID: ${paymentIntent.id}`);
  console.log(`   - Amount: $${(paymentIntent.amount / 100).toFixed(2)}`);
  console.log(`   - Status: ${paymentIntent.status}`);

} catch (error) {
  console.log('   ❌ API Key validation failed!');
  console.log(`   Error: ${error.message}`);

  if (error.type === 'StripeAuthenticationError') {
    console.log('\n   🔧 Troubleshooting:');
    console.log('   1. Make sure you copied the complete secret key');
    console.log('   2. Verify the key is from the correct Stripe account');
    console.log('   3. Check if the key is restricted to specific IPs or APIs');
    console.log('   4. Try regenerating the key in Stripe Dashboard');
  }
}

console.log('\n📝 Note: If using test keys, remember to use test card numbers like 4242 4242 4242 4242');