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
      // Si l'authentification est requise et qu'il n'y a pas de session
      if (!sessionLoading && requireAuth && !session) {
        console.log("AuthGuard - Pas de session, redirection vers auth");
        toast.error("Accès restreint", {
          description: "Veuillez vous connecter pour accéder à cette page"
        });
        navigate('/auth');
        return;
      }

      // Si les droits admin sont requis et que l'utilisateur n'est pas admin
      if (!adminLoading && requireAdmin && !isAdmin) {
        console.log("AuthGuard - Vérification admin échouée, redirection vers accueil");
        console.log("État actuel - Session:", !!session, "IsAdmin:", isAdmin);
        toast.error("Accès restreint", {
          description: "Vous n'avez pas les droits administrateur nécessaires"
        });
        navigate('/');
        return;
      }
    };

    validateAuth();
  }, [session, isAdmin, sessionLoading, adminLoading, requireAuth, requireAdmin, navigate]);

  // Afficher le loader pendant la vérification
  if (sessionLoading || (requireAdmin && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  // Si l'authentification est requise et qu'il n'y a pas de session, ne rien rendre
  if (requireAuth && !session) {
    return null;
  }

  // Si les droits admin sont requis et que l'utilisateur n'est pas admin, ne rien rendre
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}