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
  },
  // Add retry configuration
  fetch: (url: string, options: RequestInit) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).catch(error => {
      console.error('Supabase fetch error:', error);
      toast.error('Erreur de connexion', {
        description: 'Veuillez vérifier votre connexion internet'
      });
      throw error;
    });
  }
};

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, options);

// Add error event listener
supabase.auth.onError((error) => {
  console.error('Supabase auth error:', error);
  toast.error('Erreur d\'authentification', {
    description: error.message
  });
});

// Add auto-reconnect for realtime
supabase.realtime.setAuth(supabaseKey);