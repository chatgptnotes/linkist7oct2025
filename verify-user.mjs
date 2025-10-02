import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function verifyUser() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('🔍 Querying database for cmd@hopehospital.com...\n');

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'cmd@hopehospital.com')
    .single();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('✅ User found:');
  console.log('  Email:', user.email);
  console.log('  First Name:', user.first_name);
  console.log('  Last Name:', user.last_name);
  console.log('  Role:', user.role);
  console.log('  Email Verified:', user.email_verified);
  console.log('  Password Hash:', user.password_hash);
  console.log('  Hash Length:', user.password_hash?.length);
  console.log('  Hash Prefix:', user.password_hash?.substring(0, 10));
  console.log();

  // Test password comparison
  const testPassword = 'test123456';
  console.log(`🔐 Testing password: "${testPassword}"`);

  const isValid = await bcrypt.compare(testPassword, user.password_hash);
  console.log('  Result:', isValid ? '✅ MATCHES' : '❌ DOES NOT MATCH');

  // Also test with the exact hash we generated
  const expectedHash = '$2b$10$vdCe1MBPqfxmNOzK3ZQGbeiedsUnhCY4CMvNlInm4gkSJlca0zjVi';
  console.log();
  console.log('📋 Expected hash:', expectedHash);
  console.log('📋 Actual hash:  ', user.password_hash);
  console.log('📋 Hashes match:', user.password_hash === expectedHash ? '✅ YES' : '❌ NO');

  process.exit(0);
}

verifyUser().catch(console.error);
