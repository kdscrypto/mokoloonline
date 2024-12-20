import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur de session:", sessionError);
          throw new Error("Erreur lors de la vérification de la session");
        }
        
        if (requireAuth && !session) {
          setError("Vous devez être connecté pour accéder à cette page");
          toast.error("Accès restreint", {
            description: "Redirection vers la page de connexion..."
          });
          navigate('/auth');
          return;
        }

        if (requireAdmin && session) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (adminError) {
            console.error("Erreur lors de la vérification des droits admin:", adminError);
            throw new Error("Erreur lors de la vérification des droits administrateur");
          }

          if (!adminData) {
            setError("Vous n'avez pas les droits administrateur nécessaires");
            toast.error("Accès non autorisé", {
              description: "Cette page est réservée aux administrateurs"
            });
            navigate('/');
            return;
          }
        }

        setIsAuthorized(true);
        setError(null);
      } catch (error: any) {
        console.error("Erreur lors de la vérification des droits:", error);
        setError(error.message || "Une erreur est survenue lors de la vérification de vos droits");
        toast.error("Erreur de vérification", {
          description: "Impossible de vérifier vos droits d'accès"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthorized(false);
        setError("Votre session a expiré");
        if (requireAuth) {
          toast.error("Session expirée", {
            description: "Veuillez vous reconnecter"
          });
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-gray-500">Vérification des droits d'accès...</p>
      </div>
    );
  }

  if (!isAuthorized && requireAuth) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Shield className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold">Accès non autorisé</h2>
        <p className="text-sm text-gray-500">{error || "Redirection en cours..."}</p>
        <Button 
          variant="outline"
          onClick={() => navigate('/')}
          className="mt-4"
        >
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}