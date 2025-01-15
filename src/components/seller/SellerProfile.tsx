import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "../reviews/ReviewForm";
import { ReviewsList } from "../reviews/ReviewsList";
import { SellerBadges } from "./SellerBadges";
import { Star } from "lucide-react";
import { useEffect } from "react";

interface SellerProfileProps {
  sellerId: string;
  listingId?: string;
}

export function SellerProfile({ sellerId, listingId }: SellerProfileProps) {
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["seller-profile", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sellerId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: rating } = useQuery({
    queryKey: ["seller-rating", sellerId, listingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_seller_rating", { seller_id: sellerId });

      if (error) throw error;
      return data;
    },
  });

  // Configurer les abonnements en temps réel pour les avis
  useEffect(() => {
    // S'abonner aux changements de la table reviews
    const channel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Écouter tous les événements (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'reviews',
          filter: `seller_id=eq.${sellerId}` // Filtrer pour ce vendeur spécifique
        },
        () => {
          // Invalider les requêtes pour forcer un rafraîchissement
          queryClient.invalidateQueries({ queryKey: ["seller-rating", sellerId] });
          queryClient.invalidateQueries({ queryKey: ["reviews", sellerId] });
        }
      )
      .subscribe();

    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, [sellerId, queryClient]);

  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <span className="text-2xl">{profile.full_name}</span>
            {rating > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-normal">
                  {rating.toFixed(1)} / 5
                </span>
              </div>
            )}
          </div>
          <SellerBadges sellerId={sellerId} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="reviews" className="flex-1">
              Avis
            </TabsTrigger>
            <TabsTrigger value="write-review" className="flex-1">
              Laisser un avis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="reviews">
            <ReviewsList sellerId={sellerId} listingId={listingId} />
          </TabsContent>
          <TabsContent value="write-review">
            <ReviewForm sellerId={sellerId} listingId={listingId} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}