import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState, useTransition, Suspense } from "react";
import { SellerProfile } from "@/components/seller/SellerProfile";
import { SecurityGuidelines } from "@/components/listing/SecurityGuidelines";
import { ListingImage } from "@/components/listing/ListingImage";
import { ListingDetails } from "@/components/listing/ListingDetails";
import { AuthenticationPrompt } from "@/components/listing/AuthenticationPrompt";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { ListingsLoadingState } from "@/components/listings/ListingsLoadingState";
import { ListingsErrorState } from "@/components/listings/ListingsErrorState";

export default function ListingDetail() {
  const { id } = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      startTransition(() => {
        setIsAuthenticated(!!session);
      });
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      startTransition(() => {
        setIsAuthenticated(!!session);
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const { data: listing, isLoading, error, isError } = useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:profiles!listings_user_id_fkey (
            id,
            full_name,
            username,
            avatar_url,
            city,
            phone,
            created_at
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching listing:", error);
        throw error;
      }

      if (!data) {
        throw new Error("Annonce introuvable");
      }

      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  if (isLoading || isPending) {
    return <ListingsLoadingState />;
  }

  if (isError) {
    return <ListingsErrorState />;
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
    <ErrorBoundary>
      <Suspense fallback={<ListingsLoadingState />}>
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
                      onContactClick={() => {}}
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
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}