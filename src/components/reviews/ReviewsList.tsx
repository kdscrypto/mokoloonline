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
  profiles: {
    full_name: string | null;
  };
}

interface ReviewsListProps {
  sellerId: string;
}

export function ReviewsList({ sellerId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", sellerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles:reviewer_id(full_name)")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  if (isLoading) {
    return <div>Chargement des avis...</div>;
  }

  if (!reviews?.length) {
    return <div>Aucun avis pour le moment.</div>;
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
                {review.profiles.full_name || "Utilisateur anonyme"}
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