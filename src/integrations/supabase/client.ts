import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://jswhxuyuspojqwybmowt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd2h4dXl1c3BvanF3eWJtb3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0MDIwMTYsImV4cCI6MjAyMDk3ODAxNn0.GjqGvZhDqoLfVhwvxGQjEuG5rVOw2PTYxZGIuXHxBrE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  }
});