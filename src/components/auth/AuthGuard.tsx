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
    if (!sessionLoading && requireAuth && !session) {
      toast.error("Accès restreint", {
        description: "Veuillez vous connecter pour accéder à cette page"
      });
      navigate('/auth');
      return;
    }

    if (!adminLoading && requireAdmin && !isAdmin) {
      toast.error("Accès restreint", {
        description: "Vous n'avez pas les droits administrateur nécessaires"
      });
      navigate('/');
      return;
    }
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