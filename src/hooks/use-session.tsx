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
      await supabase.auth.signOut();
      toast.error("Session expirée", {
        description: "Veuillez vous reconnecter"
      });
      navigate('/auth');
    };

    const validateSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = 
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message?.includes('JWT')) {
            await handleSessionError();
            return;
          }
          throw sessionError;
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { session, isLoading };
}