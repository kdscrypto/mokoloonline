import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (requireAuth && !session) {
        toast.error("Vous devez être connecté pour accéder à cette page");
        window.location.href = 'https://mokoloonline.xyz/auth';
        return;
      }

      if (requireAdmin && session) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (!adminData) {
          toast.error("Accès non autorisé");
          window.location.href = 'https://mokoloonline.xyz';
          return;
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' && requireAuth) {
        window.location.href = 'https://mokoloonline.xyz/auth';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, requireAuth, requireAdmin]);

  return <>{children}</>;
}