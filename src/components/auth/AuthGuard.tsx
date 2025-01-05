import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useSession } from "@/hooks/use-session";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { toast } from "sonner";

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
      // Attendre que toutes les vérifications soient terminées
      if (sessionLoading || (requireAdmin && adminLoading)) {
        return;
      }

      console.log("AuthGuard - État actuel:", {
        sessionLoading,
        requireAuth,
        session: !!session,
        adminLoading,
        requireAdmin,
        isAdmin
      });

      // Vérification de l'authentification
      if (requireAuth && !session) {
        console.log("AuthGuard - Redirection vers la page de connexion");
        toast.error("Accès restreint", {
          description: "Veuillez vous connecter pour accéder à cette page"
        });
        navigate('/auth');
        return;
      }

      // Vérification des droits admin
      if (requireAdmin && !isAdmin) {
        console.log("AuthGuard - Accès admin refusé");
        toast.error("Accès restreint", {
          description: "Vous n'avez pas les droits administrateur nécessaires"
        });
        navigate('/');
        return;
      }
    };

    validateAuth();
  }, [session, isAdmin, sessionLoading, adminLoading, requireAuth, requireAdmin, navigate]);

  // Affichage du loader pendant la vérification
  if (sessionLoading || (requireAdmin && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  // Ne rien rendre si l'authentification est requise mais absente
  if (requireAuth && !session) {
    return null;
  }

  // Ne rien rendre si les droits admin sont requis mais absents
  if (requireAdmin && !isAdmin) {
    return null;
  }

  return <>{children}</>;
}