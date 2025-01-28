import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Listing } from "@/integrations/supabase/types/listing";

export function useConversation(listing: Listing, onClose: () => void) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // This hook is now deprecated and should be removed in future updates
  const startConversation = async () => {
    toast.error("La messagerie interne n'est plus disponible");
    onClose();
  };

  return { startConversation, isLoading };
}