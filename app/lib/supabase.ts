import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a new Supabase client each time to avoid singleton issues
export const getSupabaseClient = (): SupabaseClient => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        storageKey: 'task-manager-auth',
        storage:
          typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
};

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
  user_first_name?: string;
  user_last_name?: string;
  due_date: string | null;
  created_at: string;
}
