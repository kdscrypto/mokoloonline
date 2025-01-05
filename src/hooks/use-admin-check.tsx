import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./use-session";

export function useAdminCheck() {
  const { session } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminRights = async () => {
      setIsLoading(true);
      try {
        if (!session?.user?.id) {
          console.log("No session found, user is not admin");
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        console.log("Checking admin rights for user:", session.user.id);
        
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking admin rights:", error);
          setIsAdmin(false);
          return;
        }

        const isUserAdmin = !!adminData;
        console.log("Admin check result:", isUserAdmin, "Admin data:", adminData);
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error("Error in admin check:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRights();
  }, [session?.user?.id]);

  return { isAdmin, isLoading };
}