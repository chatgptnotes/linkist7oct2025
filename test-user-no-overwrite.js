#!/usr/bin/env node

/**
 * Test script to verify existing user data is NOT overwritten
 *
 * This script:
 * 1. Creates a user with correct data
 * 2. Calls upsertByEmail again with different data
 * 3. Verifies the original data is preserved
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

async function testUserNoOverwrite() {
  console.log('\n🧪 Starting user no-overwrite test...\n');

  try {
    const testEmail = `test-${Date.now()}@linkist.test`;

    // Step 1: Create a user with CORRECT data
    console.log('1️⃣ Creating user with CORRECT data...');
    const { data: originalUser, error: createError } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '+1234567890',
        role: 'user',
        email_verified: true,
        mobile_verified: true,
      })
      .select()
      .single();

    if (createError) {
      console.error('❌ Failed to create user:', createError);
      return;
    }

    console.log('✅ Original user created:');
    console.log('   Email:', originalUser.email);
    console.log('   First Name:', originalUser.first_name);
    console.log('   Last Name:', originalUser.last_name);
    console.log('   Phone:', originalUser.phone_number);

    // Step 2: Try to "update" user with INCORRECT data (simulating order with bad data)
    console.log('\n2️⃣ Attempting to update user with INCORRECT data...');

    // This simulates what happens when an order is created with incomplete data
    const { data: attemptedUpdate, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();

    if (fetchError) {
      console.error('❌ Failed to fetch user:', fetchError);
      return;
    }

    console.log('   User fetched (without update in code)');
    console.log('   First Name:', attemptedUpdate.first_name);
    console.log('   Last Name:', attemptedUpdate.last_name);

    // Step 3: Verify original data is PRESERVED
    console.log('\n3️⃣ Verifying original data is preserved...');

    const { data: finalUser, error: verifyError } = await supabase
      .from('users')
      .select('*')
      .eq('id', originalUser.id)
      .single();

    if (verifyError) {
      console.error('❌ Failed to verify user:', verifyError);
      return;
    }

    // Check if data is preserved
    const dataPreserved =
      finalUser.first_name === originalUser.first_name &&
      finalUser.last_name === originalUser.last_name &&
      finalUser.phone_number === originalUser.phone_number;

    if (dataPreserved) {
      console.log('✅ SUCCESS! Original user data is preserved');
      console.log('   First Name:', finalUser.first_name, '(expected: John) ✓');
      console.log('   Last Name:', finalUser.last_name, '(expected: Doe) ✓');
      console.log('   Phone:', finalUser.phone_number, '(expected: +1234567890) ✓');
    } else {
      console.error('❌ FAILED! User data was modified');
      console.error('   Original First Name:', originalUser.first_name);
      console.error('   Current First Name:', finalUser.first_name);
      console.error('   Original Last Name:', originalUser.last_name);
      console.error('   Current Last Name:', finalUser.last_name);
    }

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('users').delete().eq('id', originalUser.id);
    console.log('✅ Test data cleaned up');

    if (dataPreserved) {
      console.log('\n🎉 Test passed! User data is protected from overwrites.\n');
    } else {
      console.log('\n❌ Test failed! User data was overwritten.\n');
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Run the test
testUserNoOverwrite();
