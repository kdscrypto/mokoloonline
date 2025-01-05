import React from "react";
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

  // Ne pas afficher le bouton si l'utilisateur n'est pas admin
  if (!isAdmin) return null;

  return (
    <Link to="/admin" onClick={handleAdminClick}>
      <Button 
        variant="outline" 
        className="rounded-full hover:shadow-md transition-all duration-300"
      >
        <Settings className="mr-2 h-4 w-4" /> Administration
      </Button>
    </Link>
  );
};