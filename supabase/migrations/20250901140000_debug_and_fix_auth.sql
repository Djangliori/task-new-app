-- Debug and fix authentication issues

-- 1. Check existing users in auth.users
SELECT 
  id, 
  email, 
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NULL THEN 'NOT CONFIRMED'
    ELSE 'CONFIRMED'
  END as status
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check existing profiles in public.users
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  u.created_at
FROM users u
ORDER BY u.created_at DESC;

-- 3. Manually confirm all users for development
UPDATE auth.users 
SET email_confirmed_at = NOW(), 
    confirmation_token = '',
    email_change_confirm_status = 0
WHERE email_confirmed_at IS NULL;

-- 4. Create missing profiles for authenticated users
INSERT INTO users (id, email, first_name, last_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'first_name', 'Test'),
  COALESCE(au.raw_user_meta_data->>'last_name', 'User')
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE u.id IS NULL
  AND au.email_confirmed_at IS NOT NULL;

-- 5. Verify the fixes
SELECT 
  au.email,
  au.email_confirmed_at,
  u.first_name,
  u.last_name,
  CASE 
    WHEN au.email_confirmed_at IS NULL THEN 'AUTH: NOT CONFIRMED'
    WHEN u.id IS NULL THEN 'PROFILE: MISSING'
    ELSE 'OK'
  END as status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
ORDER BY au.created_at DESC;