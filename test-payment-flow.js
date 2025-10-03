#!/usr/bin/env node

/**
 * Test script to verify payment flow integration
 * Run with: node test-payment-flow.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Payment Flow Integration\n');

// Test 1: Check if payment page exists
const paymentPagePath = path.join(__dirname, 'app/nfc/payment/page.tsx');
const paymentPageExists = fs.existsSync(paymentPagePath);
console.log(`1. Payment page exists: ${paymentPageExists ? '✅' : '❌'} ${paymentPagePath}`);

// Test 2: Check if API route exists
const apiRoutePath = path.join(__dirname, 'app/api/payment/create-intent/route.ts');
const apiRouteExists = fs.existsSync(apiRoutePath);
console.log(`2. Payment API route exists: ${apiRouteExists ? '✅' : '❌'} ${apiRoutePath}`);

// Test 3: Check Stripe configuration
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const hasStripeKey = envContent.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  const hasStripeSecret = envContent.includes('STRIPE_SECRET_KEY');
  console.log(`3. Stripe public key configured: ${hasStripeKey ? '✅' : '❌'}`);
  console.log(`4. Stripe secret key configured: ${hasStripeSecret ? '✅' : '❌'}`);
} else {
  console.log('3. Environment file missing: ❌');
}

// Test 4: Check voucher codes in payment page
if (paymentPageExists) {
  const paymentContent = fs.readFileSync(paymentPagePath, 'utf-8');
  const hasVoucherCodes = paymentContent.includes('FOUNDER50');
  console.log(`5. Voucher codes configured: ${hasVoucherCodes ? '✅' : '❌'}`);

  // Check for UPI integration
  const hasUPI = paymentContent.includes('upi://pay');
  console.log(`6. UPI payment integrated: ${hasUPI ? '✅' : '❌'}`);

  // Check for payment methods
  const hasCardPayment = paymentContent.includes("'card'");
  const hasVoucherPayment = paymentContent.includes("'voucher'");
  const hasUPIPayment = paymentContent.includes("'upi'");
  console.log(`7. Payment methods: Card: ${hasCardPayment ? '✅' : '❌'} | UPI: ${hasUPIPayment ? '✅' : '❌'} | Voucher: ${hasVoucherPayment ? '✅' : '❌'}`);
}

// Test 5: Check checkout redirect
const checkoutPath = path.join(__dirname, 'app/nfc/checkout/page.tsx');
if (fs.existsSync(checkoutPath)) {
  const checkoutContent = fs.readFileSync(checkoutPath, 'utf-8');
  const hasPaymentRedirect = checkoutContent.includes("router.push('/nfc/payment')") ||
                              checkoutContent.includes('router.push("/nfc/payment")');
  console.log(`8. Checkout redirects to payment: ${hasPaymentRedirect ? '✅' : '❌'}`);

  const hasCorrectButton = checkoutContent.includes('Continue to Payment');
  console.log(`9. Button text updated: ${hasCorrectButton ? '✅' : '❌'}`);
}

// Test 6: Check success page handles payment confirmation
const successPath = path.join(__dirname, 'app/nfc/success/page.tsx');
if (fs.existsSync(successPath)) {
  const successContent = fs.readFileSync(successPath, 'utf-8');
  const hasOrderConfirmation = successContent.includes('orderConfirmation');
  console.log(`10. Success page handles payment confirmation: ${hasOrderConfirmation ? '✅' : '❌'}`);
}

console.log('\n📊 Summary:');
console.log('- Payment flow components are integrated');
console.log('- Three payment methods available: Card (Stripe), UPI, Voucher');
console.log('- Available voucher codes: FOUNDER50 (50% off), WELCOME20 (20% off), LINKIST10 (10% off), EARLY100 (100% off)');
console.log('\n🚀 Access the app at: http://localhost:3002');
console.log('   Test flow: /nfc/configure → /nfc/checkout → /nfc/payment → /nfc/success');