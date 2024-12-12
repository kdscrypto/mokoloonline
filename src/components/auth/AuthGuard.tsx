import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '@/services/auth-service';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const result = await checkSession();
        
        if (requireAuth && !result) {
          toast.error("Vous devez être connecté pour accéder à cette page");
          navigate('/auth');
          return;
        }

        if (requireAdmin && result) {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', result.session.user.id)
            .single();

          if (!adminData) {
            toast.error("Accès non autorisé");
            navigate('/');
            return;
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification des droits:", error);
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    validateAccess();
  }, [navigate, requireAuth, requireAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}