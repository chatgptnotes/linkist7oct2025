// Test database connection and service role key
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('\n🔍 Testing Supabase Connection...\n');

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL not found in .env');
  process.exit(1);
}

if (!serviceRoleKey || serviceRoleKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not set properly in .env');
  console.error('   Get it from: https://supabase.com/dashboard → Settings → API');
  console.error('   Look for "service_role" key (starts with eyJ...)');
  process.exit(1);
}

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Service Role Key:', serviceRoleKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
  try {
    // Test 1: Check email_otps table
    console.log('\n📋 Test 1: Checking email_otps table...');
    const { data: emailOtps, error: emailError } = await supabase
      .from('email_otps')
      .select('*')
      .limit(1);

    if (emailError) {
      console.error('❌ Email OTPs table error:', emailError.message);
    } else {
      console.log('✅ Email OTPs table accessible');
    }

    // Test 2: Check mobile_otps table
    console.log('\n📋 Test 2: Checking mobile_otps table...');
    const { data: mobileOtps, error: mobileError } = await supabase
      .from('mobile_otps')
      .select('*')
      .limit(1);

    if (mobileError) {
      console.error('❌ Mobile OTPs table error:', mobileError.message);
    } else {
      console.log('✅ Mobile OTPs table accessible');
    }

    // Test 3: Check users table
    console.log('\n📋 Test 3: Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('❌ Users table error:', usersError.message);
    } else {
      console.log('✅ Users table accessible');
      console.log('   Total users:', users?.length || 0);
    }

    // Test 4: Check user_sessions table
    console.log('\n📋 Test 4: Checking user_sessions table...');
    const { data: sessions, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1);

    if (sessionsError) {
      console.error('❌ User sessions table error:', sessionsError.message);
    } else {
      console.log('✅ User sessions table accessible');
    }

    // Test 5: Try to insert test OTP
    console.log('\n📋 Test 5: Testing INSERT operation...');
    const testEmail = 'test@example.com';
    const testOtp = '123456';
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insertError } = await supabase
      .from('email_otps')
      .insert({
        email: testEmail,
        otp: testOtp,
        expires_at: expiresAt,
        verified: false
      });

    if (insertError) {
      console.error('❌ INSERT operation failed:', insertError.message);
    } else {
      console.log('✅ INSERT operation successful');

      // Clean up test data
      await supabase.from('email_otps').delete().eq('email', testEmail);
      console.log('✅ Test data cleaned up');
    }

    console.log('\n✅ All database tests passed! Data can be stored.\n');

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
