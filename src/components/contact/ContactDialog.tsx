import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactButtons } from "./ContactButtons";
import { useConversation } from "./useConversation";
import type { Listing } from "@/integrations/supabase/types/listing";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: Listing;
}

export function ContactDialog({ open, onOpenChange, listing }: ContactDialogProps) {
  const { startConversation, isLoading } = useConversation(listing!, () => onOpenChange(false));

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contacter le vendeur</DialogTitle>
          <DialogDescription>
            Pour l'annonce : {listing.title}
          </DialogDescription>
        </DialogHeader>
        <ContactButtons 
          listing={listing}
          onMessageClick={startConversation}
        />
      </DialogContent>
    </Dialog>
  );
}