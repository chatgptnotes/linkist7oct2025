// Simple script to create missing OTP tables
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nyjduzifuibyowibhsjg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55amR1emlmdWlieW93aWJoc2pnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Njk0MTY0MywiZXhwIjoyMDcyNTE3NjQzfQ.1K6Ny2ZtNhXf_gQItroghc_-7j4xdxncCAGZqWHHNE0';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('🔧 Creating missing OTP tables...');
  
  try {
    // Create email_otps table
    const { error: emailError } = await supabase
      .from('email_otps')
      .select('*')
      .limit(1);
    
    if (emailError && emailError.code === 'PGRST116') {
      console.log('📧 Creating email_otps table...');
      // Table doesn't exist, we need to create it via SQL
      console.log('⚠️  email_otps table needs to be created manually in Supabase dashboard');
    } else {
      console.log('✅ email_otps table already exists');
    }
    
    // Create mobile_otps table
    const { error: mobileError } = await supabase
      .from('mobile_otps')
      .select('*')
      .limit(1);
    
    if (mobileError && mobileError.code === 'PGRST116') {
      console.log('📱 Creating mobile_otps table...');
      console.log('⚠️  mobile_otps table needs to be created manually in Supabase dashboard');
    } else {
      console.log('✅ mobile_otps table already exists');
    }
    
    console.log('\n🎯 To fix mobile verification, you need to:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
    console.log('2. Navigate to your project: nyjduzifuibyowibhsjg');
    console.log('3. Go to SQL Editor');
    console.log('4. Run the SQL from add_missing_tables.sql file');
    console.log('\n📁 The SQL file is located at: add_missing_tables.sql');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTables();
