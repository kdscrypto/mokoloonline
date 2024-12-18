import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import type { Listing } from "@/integrations/supabase/types/listing";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing?: Listing;
}

export function ContactDialog({ open, onOpenChange, listing }: ContactDialogProps) {
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
        <div className="flex flex-col gap-4 py-4">
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