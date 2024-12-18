import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '@/services/auth-service';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const result = await checkSession();
        
        if (requireAuth && !result) {
          toast.error("Vous devez être connecté pour accéder à cette page", {
            description: "Redirection vers la page de connexion..."
          });
          navigate('/auth');
          return;
        }

        if (requireAdmin && result) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', result.session.user.id)
            .single();

          if (adminError || !adminData) {
            toast.error("Accès non autorisé", {
              description: "Vous n'avez pas les droits administrateur nécessaires"
            });
            navigate('/');
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("Erreur lors de la vérification des droits:", error);
        toast.error("Une erreur est survenue", {
          description: "Impossible de vérifier vos droits d'accès"
        });
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthorized(false);
        if (requireAuth) {
          navigate('/auth');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Vérification des droits d'accès...</p>
      </div>
    );
  }

  if (!isAuthorized && requireAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Shield className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold">Accès non autorisé</h2>
        <p className="text-sm text-gray-500">Redirection en cours...</p>
      </div>
    );
  }

  return <>{children}</>;
}