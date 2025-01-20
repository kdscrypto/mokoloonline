import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session } from '@supabase/supabase-js';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session error:", error);
          if (error.message?.includes('refresh_token_not_found')) {
            await supabase.auth.signOut();
            setSession(null);
            return;
          }
          throw error;
        }

        console.log("Current session state:", { 
          hasSession: !!currentSession,
          userId: currentSession?.user?.id 
        });

        setSession(currentSession);
      } catch (error) {
        console.error("Error validating session:", error);
        toast.error("Erreur de connexion", {
          description: "Une erreur est survenue lors de la validation de votre session"
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, !!session);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        navigate('/auth');
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setSession(session);
      } else if (event === 'USER_UPDATED') {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, isLoading };
}