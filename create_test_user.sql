-- Create a test user that's already confirmed
-- Run this in Supabase SQL Editor

-- First, create the auth user (this usually happens automatically during signup)
-- But let's assume we have a test user: test@example.com with password: test123

-- Manually insert a confirmed user for testing
-- You need to replace 'YOUR_USER_ID' with a real UUID and hash the password properly

-- Step 1: Check if user exists
SELECT email, email_confirmed_at FROM auth.users WHERE email = 'test@example.com';

-- Step 2: If user exists but not confirmed, confirm them
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmation_token = '',
  email_change_confirm_status = 0
WHERE email = 'test@example.com' 
  AND email_confirmed_at IS NULL;

-- Step 3: Create profile in users table if missing
INSERT INTO users (id, email, first_name, last_name)
SELECT 
  au.id,
  au.email,
  'Test',
  'User'
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email = 'test@example.com'
  AND u.id IS NULL;

-- Step 4: Verify everything is set up
SELECT 
  au.email,
  au.email_confirmed_at as "Confirmed At",
  u.first_name,
  u.last_name,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '❌ NOT CONFIRMED'
    WHEN u.id IS NULL THEN '❌ NO PROFILE'
    ELSE '✅ READY'
  END as status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email = 'test@example.com';