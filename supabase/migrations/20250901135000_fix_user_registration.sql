-- Temporarily disable RLS on users table for registration
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Or create a more permissive policy for registration
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS "Enable read access for users based on user_id" ON users;
-- DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
-- DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;

-- CREATE POLICY "Allow users to read their own data" ON users 
--   FOR SELECT USING (auth.uid() = id);
  
-- CREATE POLICY "Allow authenticated users to insert their profile" ON users 
--   FOR INSERT WITH CHECK (auth.uid() = id);
  
-- CREATE POLICY "Allow users to update their own data" ON users 
--   FOR UPDATE USING (auth.uid() = id);