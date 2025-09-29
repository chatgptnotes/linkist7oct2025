-- Check existing tables and their structure
-- Run this in Supabase SQL Editor to see what's already there

-- 1. List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Check orders table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check if our new tables exist
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public')
    THEN '✅ users table exists' 
    ELSE '❌ users table missing' 
  END as users_status,
  
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_otps' AND table_schema = 'public')
    THEN '✅ email_otps table exists' 
    ELSE '❌ email_otps table missing' 
  END as email_otps_status,
    
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mobile_otps' AND table_schema = 'public')
    THEN '✅ mobile_otps table exists' 
    ELSE '❌ mobile_otps table missing' 
  END as mobile_otps_status,
    
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'gdpr_consents' AND table_schema = 'public')
    THEN '✅ gdpr_consents table exists' 
    ELSE '❌ gdpr_consents table missing' 
  END as gdpr_consents_status;

-- 4. Check orders table data
SELECT COUNT(*) as total_orders FROM orders;

-- 5. Check if orders table has the right structure for our Supabase integration
SELECT 
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'order_number' AND table_schema = 'public')
    THEN '✅ order_number column exists' 
    ELSE '❌ order_number column missing' 
  END as order_number_status,
    
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'card_config' AND data_type = 'jsonb' AND table_schema = 'public')
    THEN '✅ card_config JSONB column exists' 
    ELSE '❌ card_config JSONB column missing/wrong type' 
  END as card_config_status,
    
  CASE WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'emails_sent' AND data_type = 'jsonb' AND table_schema = 'public')
    THEN '✅ emails_sent JSONB column exists' 
    ELSE '❌ emails_sent JSONB column missing/wrong type' 
  END as emails_sent_status;