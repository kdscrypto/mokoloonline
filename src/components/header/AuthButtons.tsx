import { Button } from "@/components/ui/button";
import { LogIn, Settings, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { signOut } from "@/services/auth-service";
import { useModeratorCheck } from "@/hooks/use-moderator-check";

export const AuthButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isModerator, isLoading: moderatorCheckLoading } = useModeratorCheck();
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
        <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
          <LogIn className="mr-2 h-4 w-4" /> Connexion
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex gap-4">
      {isModerator && !moderatorCheckLoading && (
        <Link to="/moderation">
          <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
            <Shield className="mr-2 h-4 w-4" /> Modération
          </Button>
        </Link>
      )}
      <Link to="/dashboard">
        <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
          <Settings className="mr-2 h-4 w-4" /> Tableau de bord
        </Button>
      </Link>
      <Button 
        variant="outline" 
        className="rounded-full hover:shadow-md transition-all duration-300"
        onClick={signOut}
      >
        <LogIn className="mr-2 h-4 w-4" /> Déconnexion
      </Button>
    </div>
  );
};