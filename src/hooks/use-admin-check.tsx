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
          console.log("useAdminCheck - No session found, user is not admin", {
            sessionExists: !!session,
            userId: session?.user?.id,
            timestamp: new Date().toISOString()
          });
          setIsAdmin(false);
          return;
        }

        console.log("useAdminCheck - Checking admin rights for user:", {
          userId: session.user.id,
          email: session.user.email,
          timestamp: new Date().toISOString()
        });
        
        const { data: adminData, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("useAdminCheck - Error checking admin rights:", {
            error,
            userId: session.user.id,
            timestamp: new Date().toISOString()
          });
          setIsAdmin(false);
          return;
        }

        const isUserAdmin = !!adminData;
        console.log("useAdminCheck - Admin check result:", {
          isAdmin: isUserAdmin,
          adminData,
          userId: session.user.id,
          timestamp: new Date().toISOString()
        });
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error("useAdminCheck - Error in admin check:", {
          error,
          userId: session?.user?.id,
          timestamp: new Date().toISOString()
        });
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRights();
  }, [session?.user?.id]);

  return { isAdmin, isLoading };
}