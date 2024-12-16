import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin, MessageCircle, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { SellerProfile } from "@/components/seller/SellerProfile";

export default function ListingDetail() {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:profiles!listings_user_id_fkey (
            full_name,
            username
          )
        `)
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

  const sellerName = listing.profiles?.username || listing.profiles?.full_name || "Utilisateur inconnu";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden">
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

              {isAuthenticated ? (
                <>
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
                  </div>
                </>
              ) : (
                <div className="mt-8 text-center space-y-4">
                  <div className="p-6 bg-gray-50 rounded-lg">
                    <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Connectez-vous pour voir les détails
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Pour voir le prix et contacter le vendeur, vous devez vous connecter ou créer un compte.
                    </p>
                    <Link to="/auth">
                      <Button className="w-full">
                        Se connecter / S'inscrire
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {isAuthenticated && listing.user_id && (
          <SellerProfile sellerId={listing.user_id} listingId={id} />
        )}
      </div>
    </div>
  );
}