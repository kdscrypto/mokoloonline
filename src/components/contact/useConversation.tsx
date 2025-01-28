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
      
      // Vérification de la session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Erreur de session:", sessionError);
        throw new Error("Erreur lors de la vérification de la session");
      }

      if (!session) {
        toast.error("Vous devez être connecté pour envoyer un message");
        navigate("/auth");
        return;
      }

      const user = session.user;
      console.log("Session utilisateur:", { 
        userId: user.id,
        listingId: listing.id,
        sellerId: listing.user_id 
      });

      // S'assurer que l'utilisateur ne crée pas une conversation avec lui-même
      if (user.id === listing.user_id) {
        toast.error("Vous ne pouvez pas démarrer une conversation avec vous-même");
        return;
      }

      // Vérifier si une conversation existe déjà
      const { data: existingConversation, error: queryError } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('initiator_id', user.id)
        .eq('recipient_id', listing.user_id)
        .maybeSingle();

      if (queryError) {
        console.error("Erreur de requête:", queryError);
        throw queryError;
      }

      if (existingConversation) {
        console.log("Conversation existante trouvée:", existingConversation);
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

      if (insertError) {
        console.error("Erreur d'insertion:", insertError);
        throw insertError;
      }

      console.log("Nouvelle conversation créée");
      onClose();
      navigate(`/messages`);
      toast.success("Conversation créée avec succès");
      
    } catch (error: any) {
      console.error("Erreur complète:", error);
      toast.error("Erreur lors de la création de la conversation", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { startConversation, isLoading };
}