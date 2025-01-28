import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Listing } from "@/integrations/supabase/types/listing";

export function useConversation(listing: Listing, onClose: () => void) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const startConversation = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un message");
        navigate("/auth");
        return;
      }

      // Vérifier si une conversation existe déjà
      const { data: existingConversations, error: queryError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('initiator_id', user.id)
        .eq('recipient_id', listing.user_id);

      if (queryError) {
        throw queryError;
      }

      if (existingConversations && existingConversations.length > 0) {
        onClose();
        navigate(`/messages`);
        return;
      }

      // Créer une nouvelle conversation
      const { error: insertError } = await supabase
        .from('conversations')
        .insert({
          listing_id: listing.id,
          initiator_id: user.id,
          recipient_id: listing.user_id,
          status: 'active'
        });

      if (insertError) throw insertError;

      onClose();
      navigate(`/messages`);
      toast.success("Conversation créée");
      
    } catch (error: any) {
      toast.error("Erreur lors de la création de la conversation", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { startConversation, isLoading };
}