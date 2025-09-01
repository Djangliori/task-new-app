-- Fix RLS policies for registration
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create more permissive policies for users table
CREATE POLICY "Enable read access for users based on user_id" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Enable insert for authenticated users only" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Enable update for users based on user_id" ON users FOR UPDATE USING (auth.uid() = id);