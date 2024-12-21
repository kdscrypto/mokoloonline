import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AdminButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const { data: adminData, error } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error checking admin status:", error);
          toast.error("Erreur lors de la vérification des droits administrateur");
          setIsAdmin(false);
        } else {
          setIsAdmin(!!adminData);
        }
      } catch (error) {
        console.error("Error in admin check:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAdmin(false);
      } else if (session) {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .maybeSingle();
        
        setIsAdmin(!!adminData);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading || !isAdmin) return null;

  return (
    <Link to="/admin">
      <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
        <Settings className="mr-2 h-4 w-4" /> Administration
      </Button>
    </Link>
  );
};