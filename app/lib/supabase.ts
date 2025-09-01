import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  user_id: string;
  is_open: boolean;
  created_at: string;
}

export interface Task {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  project_id: string | null;
  user_id: string;
  due_date: string | null;
  created_at: string;
}
