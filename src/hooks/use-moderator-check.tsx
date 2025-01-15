import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "./use-session";

export function useModeratorCheck() {
  const { session } = useSession();
  const [isModerator, setIsModerator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkModeratorRights = async () => {
      setIsLoading(true);
      try {
        if (!session?.user?.id) {
          console.log("useModeratorCheck - No session found");
          setIsModerator(false);
          return;
        }

        const { data: moderatorData, error } = await supabase
          .from('moderators')
          .select('id')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("useModeratorCheck - Error checking moderator rights:", error);
          setIsModerator(false);
          return;
        }

        setIsModerator(!!moderatorData);
      } catch (error) {
        console.error("useModeratorCheck - Error:", error);
        setIsModerator(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkModeratorRights();
  }, [session?.user?.id]);

  return { isModerator, isLoading };
}