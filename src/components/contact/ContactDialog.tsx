import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Listing } from "@/integrations/supabase/types/listing";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: Listing;
}

export function ContactDialog({ open, onOpenChange, listing }: ContactDialogProps) {
  const navigate = useNavigate();

  if (!listing) return null;

  const startConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Vous devez être connecté pour envoyer un message");
        navigate("/auth");
        return;
      }

      // Vérifier si une conversation existe déjà
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('listing_id', listing.id)
        .eq('initiator_id', user.id)
        .eq('recipient_id', listing.user_id)
        .single();

      if (existingConversation) {
        navigate(`/messages`);
        return;
      }

      // Créer une nouvelle conversation
      const { data: newConversation, error } = await supabase
        .from('conversations')
        .insert({
          listing_id: listing.id,
          initiator_id: user.id,
          recipient_id: listing.user_id,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      navigate(`/messages`);
      toast.success("Conversation créée");
    } catch (error: any) {
      toast.error("Erreur lors de la création de la conversation", {
        description: error.message
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contacter le vendeur</DialogTitle>
          <DialogDescription>
            Pour l'annonce : {listing.title}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            className="w-full justify-start"
            variant="outline"
            onClick={startConversation}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Envoyer un message
          </Button>
          {listing.phone && (
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = `tel:${listing.phone}`}
            >
              <Phone className="mr-2 h-4 w-4" />
              {listing.phone}
            </Button>
          )}
          {listing.whatsapp && (
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => window.location.href = `https://wa.me/${listing.whatsapp}`}
            >
              <Mail className="mr-2 h-4 w-4" />
              WhatsApp: {listing.whatsapp}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}