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
    let retryCount = 0;
    const maxRetries = 3;
    let retryTimeout: NodeJS.Timeout;

    const handleSessionError = async () => {
      try {
        await supabase.auth.signOut();
        toast.error("Session expirée", {
          description: "Veuillez vous reconnecter"
        });
        navigate('/auth');
      } catch (error) {
        console.error("Error during signout:", error);
      }
    };

    const validateSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message?.includes('JWT') || 
              sessionError.message?.includes('token') || 
              sessionError.message?.includes('session')) {
            await handleSessionError();
            return;
          }
          throw sessionError;
        }

        // Si nous avons une session mais pas de refresh token, essayons de rafraîchir
        if (currentSession && !currentSession.refresh_token) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Tentative de rafraîchissement de la session (${retryCount}/${maxRetries})`);
            retryTimeout = setTimeout(validateSession, 1000 * retryCount);
            return;
          } else {
            console.log("Nombre maximum de tentatives atteint");
            await handleSessionError();
            return;
          }
        }

        // Réinitialiser le compteur si nous avons une session valide
        retryCount = 0;
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
      console.log("Auth state changed:", event);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setSession(null);
      } else {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [navigate]);

  return { session, isLoading };
}