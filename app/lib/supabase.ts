import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton instance with default persistent session
let supabaseClient: SupabaseClient | null = null;

// Helper function to get Supabase client (singleton pattern)
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          storageKey: 'task-manager-auth',
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        }
      }
    );
  }
  return supabaseClient;
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
