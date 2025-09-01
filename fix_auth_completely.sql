-- Complete fix for authentication issues
-- Run this ONCE in Supabase SQL Editor after disabling email confirmation

-- 1. Confirm all existing unconfirmed users
UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmation_token = NULL
WHERE email_confirmed_at IS NULL;

-- 2. Show results
SELECT 
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
ORDER BY created_at DESC;