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
      setIsLoading(true);
      try {
        if (!session?.user?.id) {
          console.log("No session found, user is not admin");
          setIsAdmin(false);
          return;
        }

        console.log("Checking admin rights for user:", session.user.id);
        
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .single();

        if (adminError) {
          console.error("Admin check error:", adminError);
          setIsAdmin(false);
          return;
        }

        console.log("Admin check result:", adminData);
        setIsAdmin(!!adminData);
      } catch (error) {
        console.error("Error in admin check:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRights();
  }, [session]);

  return { isAdmin, isLoading };
}