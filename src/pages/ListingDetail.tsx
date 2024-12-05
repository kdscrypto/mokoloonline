import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ListingDetail() {
  const { id } = useParams();

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*, profiles(full_name)')
        .eq('id', id)
        .single();

      if (error) {
        toast.error("Erreur lors du chargement de l'annonce");
        throw error;
      }

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Annonce introuvable</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            {listing.image_url ? (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Aucune image disponible</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">{listing.location}</span>
            </div>
            
            <span className="price-tag w-fit">
              {listing.price.toLocaleString()} FCFA
            </span>
            
            <p className="text-gray-600">{listing.description}</p>
            
            <div className="mt-auto space-y-4">
              <h3 className="font-semibold">
                Vendeur: {listing.profiles?.full_name || "Anonyme"}
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
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}