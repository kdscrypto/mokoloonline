import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, isLoading: sessionLoading } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      if (sessionLoading) {
        return;
      }

      console.log("AuthGuard - Validation d'accès:", {
        sessionLoading,
        requireAuth,
        hasSession: !!session,
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

      setIsAuthorized(true);
    };

    validateAccess();
  }, [session, sessionLoading, requireAuth, navigate, location]);

  // Affichage du loader pendant la vérification
  if (sessionLoading) {
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