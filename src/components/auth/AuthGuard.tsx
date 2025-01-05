import { useEffect, useState } from "react";
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
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      // Attendre que toutes les vérifications soient terminées
      if (sessionLoading || (requireAdmin && adminLoading)) {
        return;
      }

      console.log("AuthGuard - Validation d'accès:", {
        sessionLoading,
        requireAuth,
        hasSession: !!session,
        adminLoading,
        requireAdmin,
        isAdmin,
        userId: session?.user?.id
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
        console.log("AuthGuard - Accès admin refusé, isAdmin:", isAdmin);
        toast.error("Accès restreint", {
          description: "Vous n'avez pas les droits administrateur nécessaires"
        });
        navigate('/');
        return;
      }

      setIsAuthorized(true);
    };

    validateAccess();
  }, [session, isAdmin, sessionLoading, adminLoading, requireAuth, requireAdmin, navigate]);

  // Affichage du loader pendant la vérification
  if (sessionLoading || (requireAdmin && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  // Ne rien rendre tant que l'autorisation n'est pas confirmée
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}