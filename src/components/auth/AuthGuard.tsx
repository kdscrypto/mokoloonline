import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useSession } from "@/hooks/use-session";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const { session, isLoading: sessionLoading } = useSession();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();

  useEffect(() => {
    const validateAuth = async () => {
      if (!sessionLoading && requireAuth && !session) {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          toast.error("Accès restreint", {
            description: "Veuillez vous connecter pour accéder à cette page"
          });
          navigate('/auth');
          return;
        }
      }

      if (!adminLoading && requireAdmin && !isAdmin) {
        toast.error("Accès restreint", {
          description: "Vous n'avez pas les droits administrateur nécessaires"
        });
        navigate('/');
        return;
      }
    };

    validateAuth();
  }, [session, isAdmin, sessionLoading, adminLoading, requireAuth, requireAdmin, navigate]);

  if (sessionLoading || (requireAdmin && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}