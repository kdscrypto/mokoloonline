import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star } from "lucide-react";

interface ReviewFormProps {
  sellerId: string;
  listingId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ sellerId, listingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour laisser un avis");
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        seller_id: sellerId,
        listing_id: listingId,
        rating,
        comment,
        reviewer_id: user.id
      });

      if (error) throw error;

      toast.success("Avis publié avec succès !");
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch (error: any) {
      toast.error("Erreur lors de la publication de l'avis");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= rating
                  ? "fill-primary text-primary"
                  : "fill-none text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>

      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Partagez votre expérience..."
        className="min-h-[100px]"
        required
      />

      <Button type="submit" disabled={rating === 0 || isSubmitting}>
        Publier l'avis
      </Button>
    </form>
  );
}