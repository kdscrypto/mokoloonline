import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const { session, isLoading: sessionLoading } = useSession();
  const { isAdmin, isLoading: adminCheckLoading } = useAdminCheck();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      if (sessionLoading || adminCheckLoading) {
        return;
      }

      console.log("AuthGuard - Validation d'accès:", {
        sessionLoading,
        adminCheckLoading,
        requireAuth,
        requireAdmin,
        hasSession: !!session,
        isAdmin,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        currentPath: location.pathname
      });

      // Vérification de l'authentification
      if (requireAuth && !session?.user) {
        console.log("AuthGuard - Redirection vers la page de connexion");
        toast.error("Accès restreint", {
          description: "Veuillez vous connecter pour accéder à cette page"
        });
        navigate('/auth', { state: { from: location.pathname } });
        return;
      }

      // Vérification des droits admin
      if (requireAdmin && !isAdmin) {
        console.log("AuthGuard - Accès refusé (droits admin requis)");
        toast.error("Accès restreint", {
          description: "Vous n'avez pas les droits nécessaires pour accéder à cette page"
        });
        navigate('/');
        return;
      }

      setIsAuthorized(true);
    };

    validateAccess();
  }, [session, sessionLoading, adminCheckLoading, requireAuth, requireAdmin, isAdmin, navigate, location]);

  // Affichage du loader pendant la vérification
  if (sessionLoading || adminCheckLoading) {
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