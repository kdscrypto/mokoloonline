import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    full_name: string | null;
    username: string | null;
  };
}

interface ReviewsListProps {
  sellerId: string;
  listingId?: string;
}

export function ReviewsList({ sellerId, listingId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", sellerId, listingId],
    queryFn: async () => {
      let query = supabase
        .from("reviews")
        .select(`
          id,
          rating,
          comment,
          created_at,
          reviewer:profiles!reviews_reviewer_id_fkey(
            full_name,
            username
          )
        `)
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      // Filter reviews for specific listing if listingId is provided
      if (listingId) {
        query = query.eq("listing_id", listingId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }

      return data as unknown as Review[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Aucun avis pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-primary text-primary"
                        : "fill-none text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">
                {review.reviewer.username || review.reviewer.full_name || "Utilisateur inconnu"}
              </span>
            </div>
            <time className="text-sm text-muted-foreground">
              {format(new Date(review.created_at), "d MMMM yyyy", { locale: fr })}
            </time>
          </div>
          <p className="text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}