import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSession } from "./use-session";

export function useProfile() {
  const { session } = useSession();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("Erreur lors de la récupération du profil");
          return;
        }

        setProfile(profile);
      } catch (error) {
        console.error("Error in profile fetch:", error);
        toast.error("Erreur lors de la récupération du profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session]);

  return { profile, isLoading };
}