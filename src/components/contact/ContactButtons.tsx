import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail } from "lucide-react";
import type { Listing } from "@/integrations/supabase/types/listing";

interface ContactButtonsProps {
  listing: Listing;
  onMessageClick: () => void;
}

export function ContactButtons({ listing, onMessageClick }: ContactButtonsProps) {
  return (
    <div className="flex flex-col gap-4 py-4">
      <Button
        className="w-full justify-start"
        variant="outline"
        onClick={onMessageClick}
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
  );
}