#!/usr/bin/env node
/**
 * Test script for email OTP verification flow
 * Run: node test-email-otp.js
 */

const testEmail = 'cmd@hopehospital.com';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testEmailOTPFlow() {
  console.log('\n🧪 Testing Email OTP Verification Flow\n');
  console.log(`📧 Testing with email: ${testEmail}`);
  console.log(`🌐 Base URL: ${baseUrl}\n`);

  try {
    // Step 1: Send OTP
    console.log('Step 1: Sending OTP...');
    const sendResponse = await fetch(`${baseUrl}/api/send-email-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: testEmail }),
    });

    const sendData = await sendResponse.json();

    if (!sendResponse.ok) {
      console.error('❌ Failed to send OTP:', sendData.error);
      return;
    }

    console.log('✅ OTP sent successfully');
    console.log('Response:', JSON.stringify(sendData, null, 2));

    // Extract OTP from dev response
    const otp = sendData.devOtp;

    if (!otp) {
      console.log('\n⚠️  No devOtp in response. Check server console for the OTP code.');
      console.log('   (In production, the OTP would be sent via email)\n');
      return;
    }

    console.log(`\n🔑 Generated OTP: ${otp}\n`);

    // Step 2: Wait a moment (simulate user entering code)
    console.log('Step 2: Waiting 1 second before verification...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Verify OTP
    console.log('Step 3: Verifying OTP...');
    const verifyResponse = await fetch(`${baseUrl}/api/verify-email-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        otp: otp
      }),
    });

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok) {
      console.error('❌ Verification failed:', verifyData.error);
      return;
    }

    console.log('✅ Email verified successfully!');
    console.log('Response:', JSON.stringify(verifyData, null, 2));
    console.log('\n🎉 Email OTP verification flow test PASSED!\n');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack:', error.stack);
    console.log('\n⚠️  Make sure the development server is running: npm run dev\n');
  }
}

// Test invalid OTP
async function testInvalidOTP() {
  console.log('\n🧪 Testing Invalid OTP...\n');

  try {
    // Send OTP first
    await fetch(`${baseUrl}/api/send-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    // Try with wrong OTP
    const verifyResponse = await fetch(`${baseUrl}/api/verify-email-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        otp: '000000'
      }),
    });

    const verifyData = await verifyResponse.json();

    if (verifyResponse.ok) {
      console.error('❌ Invalid OTP was accepted! Security issue!');
      return;
    }

    console.log('✅ Invalid OTP correctly rejected');
    console.log('Response:', JSON.stringify(verifyData, null, 2));

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run tests
(async () => {
  await testEmailOTPFlow();
  await testInvalidOTP();
})();
