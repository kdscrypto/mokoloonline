import { Button } from "@/components/ui/button";
import { LogIn, Settings, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/services/auth-service";
import { useAdminCheck } from "@/hooks/use-admin-check";

export const AuthButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isAdmin, isLoading: adminCheckLoading } = useAdminCheck();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, !!session);
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <Link to="/auth">
        <Button variant="outline" size="sm" className="rounded-full hover:shadow-md transition-all duration-300">
          <LogIn className="mr-2 h-3 w-3" /> Connexion
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-4">
      {isAdmin && !adminCheckLoading && (
        <Link to="/moderation">
          <Button variant="outline" size="sm" className="rounded-full hover:shadow-md transition-all duration-300">
            <Shield className="mr-2 h-3 w-3" /> Modération
          </Button>
        </Link>
      )}
      <Link to="/dashboard">
        <Button variant="outline" size="sm" className="rounded-full hover:shadow-md transition-all duration-300">
          <Settings className="mr-2 h-3 w-3" /> Tableau de bord
        </Button>
      </Link>
      <Button 
        variant="outline" 
        size="sm"
        className="rounded-full hover:shadow-md transition-all duration-300"
        onClick={signOut}
      >
        <LogIn className="mr-2 h-3 w-3" /> Déconnexion
      </Button>
    </div>
  );
};