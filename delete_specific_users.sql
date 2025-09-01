-- Delete specific users from screenshot
-- Run this in Supabase SQL Editor

-- Delete specific users by email
DELETE FROM users WHERE email IN (
  'levani@gmail.com',
  'mariam2000@gmail.com', 
  'lasha23@gmail.com'
);

-- Delete from auth.users 
DELETE FROM auth.users WHERE email IN (
  'levani@gmail.com',
  'mariam2000@gmail.com',
  'lasha23@gmail.com'
);

-- Alternative: Delete by UID if emails don't work
-- DELETE FROM auth.users WHERE id IN (
--   '5887f191-3f48-48e1-8644-fc8a31646083',
--   '664b1955-5c8a-4abf-80ae-a3331959ee0e', 
--   '558cd1af-b217-43d0-8856-c9b779ba3066'
-- );

-- Verify deletion
SELECT 
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC;