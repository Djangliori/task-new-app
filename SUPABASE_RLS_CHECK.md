# 🔒 Supabase RLS Policies Verification Guide

## 1. Check Current RLS Status

Go to Supabase Dashboard → SQL Editor and run these queries:

### Check if RLS is enabled:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'tasks', 'projects');
```

**Expected Result:**
```
schemaname | tablename | rowsecurity
-----------|-----------|------------
public     | users     | t
public     | tasks     | t  
public     | projects  | t
```

### Check existing policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'tasks', 'projects');
```

## 2. If RLS is NOT configured, run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can view own users" ON users;
DROP POLICY IF EXISTS "Users can insert own users" ON users;
DROP POLICY IF EXISTS "Users can update own users" ON users;
DROP POLICY IF EXISTS "Users can delete own users" ON users;

CREATE POLICY "Users can view own users" ON users
  FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can insert own users" ON users
  FOR INSERT WITH CHECK (auth.uid() = id::uuid);

CREATE POLICY "Users can update own users" ON users
  FOR UPDATE USING (auth.uid() = id::uuid);

CREATE POLICY "Users can delete own users" ON users
  FOR DELETE USING (auth.uid() = id::uuid);

-- Tasks table policies  
DROP POLICY IF EXISTS "Users can view own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON tasks;

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id::uuid);

-- Projects table policies
DROP POLICY IF EXISTS "Users can view own projects" ON projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON projects;

CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id::uuid);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id::uuid);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id::uuid);
```

## 3. Expected Policies After Setup:

### Users Table (4 policies):
- Users can view own users (SELECT)
- Users can insert own users (INSERT) 
- Users can update own users (UPDATE)
- Users can delete own users (DELETE)

### Tasks Table (4 policies):
- Users can view own tasks (SELECT)
- Users can insert own tasks (INSERT)
- Users can update own tasks (UPDATE)
- Users can delete own tasks (DELETE)

### Projects Table (4 policies):
- Users can view own projects (SELECT)
- Users can insert own projects (INSERT)
- Users can update own projects (UPDATE) 
- Users can delete own projects (DELETE)

## 4. What RLS Does:

✅ **Security**: Users can only access their own data
✅ **Privacy**: User A cannot see User B's tasks/projects  
✅ **Data Isolation**: Each user has their own workspace
✅ **Automatic Filtering**: Database automatically filters by user_id

## 5. Why RLS Was Causing 406 Errors:

❌ **Before**: Code tried to access users table without proper policies
❌ **Result**: Supabase blocked access (406 Not Acceptable)
✅ **After**: Code uses auth.user metadata (no database query needed)

## Current Status:
Our app now uses `session.user.user_metadata` instead of querying the users table directly, which eliminates the RLS permission issue entirely.