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
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (adminError) {
          console.error("Error checking admin rights:", adminError);
          toast.error("Erreur lors de la vérification des droits administrateur");
          setIsAdmin(false);
          return;
        }

        console.log("Admin check result:", adminData);
        // adminData will be null if no matching row is found
        setIsAdmin(!!adminData);
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