#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifySchema() {
  console.log('🔍 Verifying database schema...')
  
  // Check all tables
  const tables = ['users', 'orders', 'email_otps', 'mobile_otps', 'gdpr_consents']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`)
        
        // If GDPR table missing, create it
        if (table === 'gdpr_consents' && error.message.includes('does not exist')) {
          console.log('🔧 Creating missing gdpr_consents table...')
          
          const createGdprTable = `
            CREATE TABLE gdpr_consents (
              id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
              email VARCHAR(255) NOT NULL,
              consents JSONB NOT NULL,
              ip_address INET,
              user_agent TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
            );
            
            CREATE INDEX idx_gdpr_consents_email ON gdpr_consents(email);
            ALTER TABLE gdpr_consents ENABLE ROW LEVEL SECURITY;
          `
          
          // Note: We can't execute DDL directly via the client, this would need to be done in SQL Editor
          console.log('⚠️  Please run this in Supabase SQL Editor:')
          console.log(createGdprTable)
        }
      } else {
        console.log(`✅ Table '${table}' exists and is accessible`)
      }
    } catch (err) {
      console.log(`❌ Table '${table}' error: ${err.message}`)
    }
  }
  
  // Test a simple insert/select operation
  console.log('🧪 Testing database operations...')
  
  try {
    // Test email OTP functionality
    const testOtp = {
      email: 'test@example.com',
      otp: '123456',
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now
    }
    
    const { data, error } = await supabase
      .from('email_otps')
      .insert([testOtp])
      .select()
    
    if (error) {
      console.log(`❌ Insert test failed: ${error.message}`)
    } else {
      console.log('✅ Database insert/select test passed')
      
      // Clean up test data
      await supabase
        .from('email_otps')
        .delete()
        .eq('email', 'test@example.com')
    }
    
  } catch (err) {
    console.log(`❌ Database operation test failed: ${err.message}`)
  }
  
  console.log('✨ Schema verification completed!')
}

verifySchema()

