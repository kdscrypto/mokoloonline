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
      console.log("Auth state changed:", event, !!session);
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      // First check if we still have a valid session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, just clean up the UI state
        setIsAuthenticated(false);
        toast.success("Déconnexion réussie");
        navigate("/");
        return;
      }

      // Proceed with logout if we have a session
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Erreur de déconnexion:", error);
        if (error.message?.includes('session_not_found')) {
          // If session not found, clean up the UI state
          setIsAuthenticated(false);
          toast.success("Déconnexion réussie");
          navigate("/");
          return;
        }
        throw error;
      }
      
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error: any) {
      console.error("Erreur de déconnexion:", error);
      // Even if there's an error, we should clean up the UI state
      setIsAuthenticated(false);
      toast.success("Déconnexion réussie");
      navigate("/");
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