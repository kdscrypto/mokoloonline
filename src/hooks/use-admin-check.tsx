import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "./use-session";

export function useAdminCheck() {
  const { session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRights = async () => {
      if (!session?.user?.id) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        console.log("Checking admin rights for user:", session.user.id);
        
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (adminError) {
          if (adminError.code === 'PGRST116') {
            // Pas d'erreur, l'utilisateur n'est simplement pas admin
            console.log("User is not admin");
            setIsAdmin(false);
          } else {
            console.error("Error checking admin rights:", adminError);
            toast.error("Erreur lors de la vérification des droits administrateur");
            setIsAdmin(false);
          }
        } else {
          console.log("Admin check result:", adminData);
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error in admin check:", error);
        toast.error("Erreur lors de la vérification des droits administrateur");
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRights();
  }, [session]);

  return { isAdmin, isLoading };
}