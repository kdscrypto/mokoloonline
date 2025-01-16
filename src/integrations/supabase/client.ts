import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from 'sonner';

const supabaseUrl = "https://jswhxuyuspojqwybmowt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impzd2h4dXl1c3BvanF3eWJtb3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMzkwMjIsImV4cCI6MjA0ODgxNTAyMn0.zdAYSiGgvLFAfWDl3-RnUKxTwt16DQBsXEnCH842Bbc";

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-client',
    },
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, options);

// Add error handling for network issues
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  }
});

// Add network error handling
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    const response = await originalFetch(...args);
    return response;
  } catch (error) {
    console.error('Network error:', error);
    toast.error('Erreur de connexion', {
      description: 'Veuillez vérifier votre connexion internet'
    });
    throw error;
  }
};