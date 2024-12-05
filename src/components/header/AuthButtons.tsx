import { Button } from "@/components/ui/button";
import { LogIn, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AuthButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
    <Link to="/dashboard">
      <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
        <Settings className="mr-2 h-4 w-4" /> Tableau de bord
      </Button>
    </Link>
  );
};