import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function useSession() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();

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

        // If we have a session but no refresh token, sign out
        if (currentSession && !currentSession.refresh_token) {
          await handleSessionError();
          return;
        }

        setSession(currentSession);
      } catch (error) {
        console.error("Error validating session:", error);
        toast.error("Erreur lors de la validation de la session");
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        setSession(session);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, isLoading };
}