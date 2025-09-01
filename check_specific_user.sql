-- Check specific user: manjgalashvili@gmail.com
-- Run this in Supabase SQL Editor

-- 1. Check if user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN '❌ NOT CONFIRMED'
    ELSE '✅ CONFIRMED'
  END as confirmation_status
FROM auth.users 
WHERE email = 'manjgalashvili@gmail.com';

-- 2. Check if profile exists in users table
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.created_at
FROM users u
JOIN auth.users au ON u.id = au.id
WHERE au.email = 'manjgalashvili@gmail.com';

-- 3. Combined check
SELECT 
  au.email,
  au.email_confirmed_at,
  au.created_at as auth_created,
  u.first_name,
  u.last_name,
  u.created_at as profile_created,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN '🔴 Email not confirmed'
    WHEN u.id IS NULL THEN '🟡 Profile missing'
    ELSE '🟢 Ready to login'
  END as status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email = 'manjgalashvili@gmail.com';