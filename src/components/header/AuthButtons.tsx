import { Button } from "@/components/ui/button";
import { LogIn, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthButtons = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
      console.error("Erreur de déconnexion:", error);
    }
  };

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
      <Link to="/dashboard">
        <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
          <Settings className="mr-2 h-4 w-4" /> Tableau de bord
        </Button>
      </Link>
      <Button 
        variant="outline" 
        className="rounded-full hover:shadow-md transition-all duration-300"
        onClick={handleLogout}
      >
        <LogIn className="mr-2 h-4 w-4" /> Déconnexion
      </Button>
    </div>
  );
};