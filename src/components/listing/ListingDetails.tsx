import { Button } from "@/components/ui/button";
import { Phone, MessageCircle } from "lucide-react";
import type { Listing } from "@/integrations/supabase/types/listing";
import { useNavigate } from "react-router-dom";

interface ListingDetailsProps {
  listing: Listing;
  onContactClick: () => void;
}

export function ListingDetails({ listing, onContactClick }: ListingDetailsProps) {
  const navigate = useNavigate();
  const sellerName = listing.profiles?.username || listing.profiles?.full_name || "Utilisateur inconnu";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{listing.title}</h1>
      
      <span className="price-tag w-fit">
        {listing.price.toLocaleString()} FCFA
      </span>
      
      <p className="text-gray-600">{listing.description}</p>
      
      <div className="mt-auto space-y-4">
        <h3 className="font-semibold">
          Vendeur: {sellerName}
        </h3>
        
        {listing.phone && (
          <Button className="w-full" onClick={() => window.location.href = `tel:${listing.phone}`}>
            <Phone className="mr-2 h-4 w-4" />
            {listing.phone}
          </Button>
        )}
        
        {listing.whatsapp && (
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => window.open(`https://wa.me/${listing.whatsapp.replace(/\D/g, '')}`, '_blank')}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
        )}

        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate("/messages")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Messagerie interne
        </Button>
      </div>
    </div>
  );
}