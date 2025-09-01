-- Clear all authentication and profile data
-- Run this in Supabase SQL Editor

-- 1. First, delete all profiles from users table
DELETE FROM users;

-- 2. Delete all authentication users 
-- Note: This will cascade and remove all related data
DELETE FROM auth.users;

-- 3. Verify everything is cleared
SELECT 'auth.users' as table_name, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'users' as table_name, COUNT(*) as count FROM users;

-- Expected result: both should show count = 0