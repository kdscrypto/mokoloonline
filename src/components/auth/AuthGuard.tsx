import { useEffect, useState } from "react";
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

      // Si l'utilisateur est connecté et que c'est un email autorisé, l'ajouter aux admin_users
      if (session?.user) {
        const { data: allowedEmail } = await supabase
          .from('admin_allowed_emails')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (allowedEmail) {
          const { error: insertError } = await supabase
            .from('admin_users')
            .insert({ user_id: session.user.id })
            .select()
            .single();

          if (!insertError || insertError.code === '23505') { // 23505 est le code d'erreur pour une violation de contrainte unique
            console.log("Utilisateur ajouté ou déjà présent dans admin_users");
          }
        }
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