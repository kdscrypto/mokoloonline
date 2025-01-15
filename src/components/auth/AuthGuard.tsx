import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const navigate = useNavigate();
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
        userEmail: session?.user?.email
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

      setIsAuthorized(true);
    };

    validateAccess();
  }, [session, sessionLoading, requireAuth, navigate]);

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