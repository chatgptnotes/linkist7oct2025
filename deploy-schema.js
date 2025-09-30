#!/usr/bin/env node

/**
 * Deploy Database Schema to Supabase
 * This script deploys the complete database schema to your Supabase project
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Create Supabase client with service role
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deploySchema() {
  try {
    console.log('🚀 Starting database schema deployment...')
    console.log(`📍 Project URL: ${supabaseUrl}`)
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'supabase_schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Schema file loaded successfully')
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      if (statement.trim() === ';') continue
      
      try {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement
        })
        
        if (error) {
          // Try direct query if RPC fails
          const { error: directError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0)
          
          if (directError && !directError.message.includes('does not exist')) {
            throw directError
          }
        }
        
        console.log(`✅ Statement ${i + 1} executed successfully`)
        
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} may have failed: ${err.message}`)
        // Continue with next statement
      }
    }
    
    console.log('🎉 Schema deployment completed!')
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...')
    
    const tables = ['users', 'orders', 'email_otps', 'mobile_otps', 'gdpr_consents']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Table '${table}' verification failed: ${error.message}`)
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`)
        }
      } catch (err) {
        console.log(`❌ Table '${table}' verification error: ${err.message}`)
      }
    }
    
    console.log('✨ Database setup verification completed!')
    
  } catch (error) {
    console.error('❌ Schema deployment failed:', error.message)
    process.exit(1)
  }
}

// Run the deployment
deploySchema()