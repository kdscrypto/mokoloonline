import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminCheck } from "@/hooks/use-admin-check";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

export const AdminButton = () => {
  const { session } = useSession();
  const { isAdmin, isLoading } = useAdminCheck();

  useEffect(() => {
    console.log("AdminButton - Session:", !!session, "IsAdmin:", isAdmin, "IsLoading:", isLoading);
  }, [session, isAdmin, isLoading]);

  const handleAdminClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      toast.error("Accès restreint", {
        description: "Veuillez vous connecter pour accéder à l'administration"
      });
      return;
    }

    if (!isAdmin) {
      e.preventDefault();
      toast.error("Accès restreint", {
        description: "Vous n'avez pas les droits administrateur nécessaires"
      });
      return;
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="rounded-full" disabled>
        <LoadingIndicator size="sm" />
      </Button>
    );
  }

  // Afficher le bouton si l'utilisateur est connecté et admin
  if (session && isAdmin) {
    return (
      <Link to="/admin">
        <Button 
          variant="outline" 
          className="rounded-full hover:shadow-md transition-all duration-300"
          onClick={handleAdminClick}
        >
          <Settings className="mr-2 h-4 w-4" /> Administration
        </Button>
      </Link>
    );
  }

  return null;
};