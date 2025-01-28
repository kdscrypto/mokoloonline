import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { SellerProfile } from "@/components/seller/SellerProfile";
import { SecurityGuidelines } from "@/components/listing/SecurityGuidelines";
import { ContactDialog } from "@/components/contact/ContactDialog";
import { ListingImage } from "@/components/listing/ListingImage";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { AuthenticationPrompt } from "@/components/listing/AuthenticationPrompt";

export default function ListingDetail() {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">
            <div>
              <ListingImage imageUrl={listing.image_url} title={listing.title} />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <span className="text-gray-500">{listing.location}</span>
              </div>

              {isAuthenticated ? (
                <ListingDetails 
                  listing={listing} 
                  onContactClick={() => setIsContactOpen(true)} 
                />
              ) : (
                <AuthenticationPrompt />
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SecurityGuidelines 
            isOpen={isSecurityOpen}
            onOpenChange={setIsSecurityOpen}
          />
        </Card>

        {isAuthenticated && listing.user_id && (
          <SellerProfile sellerId={listing.user_id} listingId={id} />
        )}
      </div>

      <ContactDialog 
        open={isContactOpen}
        onOpenChange={setIsContactOpen}
        listing={listing}
      />
    </div>
  );
}