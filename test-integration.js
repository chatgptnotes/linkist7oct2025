#!/usr/bin/env node

/**
 * Test Supabase Integration
 * This script tests all aspects of your Supabase integration
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Starting Supabase Integration Tests...')
console.log(`📍 Project URL: ${supabaseUrl}`)
console.log(`🔑 Service Key: ${supabaseServiceKey ? '✅ Configured' : '❌ Missing'}`)
console.log(`🔑 Anon Key: ${supabaseAnonKey ? '✅ Configured' : '❌ Missing'}`)

// Create clients
const supabaseService = createClient(supabaseUrl, supabaseServiceKey)
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabaseConnectivity() {
  console.log('\n🔗 Testing Database Connectivity...')
  
  // Test 1: Service role connection
  try {
    const { data, error } = await supabaseService
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log(`❌ Service role connection failed: ${error.message}`)
    } else {
      console.log('✅ Service role connection successful')
    }
  } catch (err) {
    console.log(`❌ Service role connection error: ${err.message}`)
  }
  
  // Test 2: Anonymous connection
  try {
    const { data, error } = await supabaseAnon
      .from('email_otps')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log(`❌ Anonymous connection failed: ${error.message}`)
    } else {
      console.log('✅ Anonymous connection successful')
    }
  } catch (err) {
    console.log(`❌ Anonymous connection error: ${err.message}`)
  }
}

async function testEmailOTP() {
  console.log('\n📧 Testing Email OTP System...')
  
  const testEmail = 'test@linkist.ai'
  const testOTP = Math.floor(100000 + Math.random() * 900000).toString()
  
  try {
    // Insert test OTP
    const { data, error: insertError } = await supabaseService
      .from('email_otps')
      .insert([{
        email: testEmail,
        otp: testOTP,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      }])
      .select()
    
    if (insertError) {
      console.log(`❌ OTP insert failed: ${insertError.message}`)
      return
    }
    
    console.log('✅ Email OTP insert successful')
    
    // Verify OTP
    const { data: verifyData, error: verifyError } = await supabaseAnon
      .from('email_otps')
      .select('*')
      .eq('email', testEmail)
      .eq('otp', testOTP)
      .single()
    
    if (verifyError) {
      console.log(`❌ OTP verification failed: ${verifyError.message}`)
    } else {
      console.log('✅ Email OTP verification successful')
    }
    
    // Cleanup
    await supabaseService
      .from('email_otps')
      .delete()
      .eq('email', testEmail)
    
    console.log('✅ Test cleanup completed')
    
  } catch (err) {
    console.log(`❌ Email OTP test error: ${err.message}`)
  }
}

async function testOrderCreation() {
  console.log('\n🛒 Testing Order Creation...')
  
  const testOrder = {
    order_number: `TEST_${Date.now()}`,
    customer_name: 'Test Customer',
    email: 'test@linkist.ai',
    phone_number: '+919876543210',
    card_config: {
      name: 'Test Card',
      title: 'Test Title',
      bio: 'Test Bio'
    },
    shipping: {
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      zip: '12345'
    },
    pricing: {
      subtotal: 499,
      shipping: 99,
      total: 598
    }
  }
  
  try {
    const { data, error } = await supabaseService
      .from('orders')
      .insert([testOrder])
      .select()
    
    if (error) {
      console.log(`❌ Order creation failed: ${error.message}`)
      return
    }
    
    console.log('✅ Order creation successful')
    console.log(`📦 Order ID: ${data[0].id}`)
    
    // Test order retrieval
    const { data: fetchData, error: fetchError } = await supabaseService
      .from('orders')
      .select('*')
      .eq('order_number', testOrder.order_number)
      .single()
    
    if (fetchError) {
      console.log(`❌ Order retrieval failed: ${fetchError.message}`)
    } else {
      console.log('✅ Order retrieval successful')
    }
    
    // Cleanup
    await supabaseService
      .from('orders')
      .delete()
      .eq('order_number', testOrder.order_number)
    
    console.log('✅ Order test cleanup completed')
    
  } catch (err) {
    console.log(`❌ Order creation test error: ${err.message}`)
  }
}

async function testRLS() {
  console.log('\n🔒 Testing Row Level Security...')
  
  try {
    // Test anonymous access to protected table
    const { data, error } = await supabaseAnon
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('✅ RLS is working - anonymous access properly restricted')
    } else {
      console.log('⚠️  RLS may not be properly configured - anonymous access allowed')
    }
    
  } catch (err) {
    console.log(`❌ RLS test error: ${err.message}`)
  }
}

async function runAllTests() {
  await testDatabaseConnectivity()
  await testEmailOTP()
  await testOrderCreation()
  await testRLS()
  
  console.log('\n🎉 Integration tests completed!')
  console.log('\n📋 Next Steps:')
  console.log('1. Start your Next.js app: npm run dev')
  console.log('2. Test the complete flow at: http://localhost:3000/nfc/configure')
  console.log('3. Check admin dashboard at: http://localhost:3000/admin')
}

runAllTests().catch(console.error)