import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { z } from "zod";

// Schéma de validation pour les avis
const reviewSchema = z.object({
  rating: z.number().min(1, "Une note est requise").max(5),
  comment: z.string().min(10, "Le commentaire doit faire au moins 10 caractères").max(500, "Le commentaire ne doit pas dépasser 500 caractères"),
});

interface ReviewFormProps {
  sellerId: string;
  listingId?: string;
  onSuccess?: () => void;
}

export function ReviewForm({ sellerId, listingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validation des données
      reviewSchema.parse({ rating, comment });
      
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour laisser un avis");
        return;
      }

      // Vérification si l'utilisateur a déjà laissé un avis
      const { data: existingReview } = await supabase
        .from("reviews")
        .select()
        .eq("reviewer_id", user.id)
        .eq("seller_id", sellerId)
        .single();

      if (existingReview) {
        toast.error("Vous avez déjà laissé un avis pour ce vendeur");
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

      toast.success("Votre avis a été publié avec succès !");
      setRating(0);
      setComment("");
      onSuccess?.();
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Une erreur est survenue lors de la publication de l'avis");
        console.error("Error submitting review:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Note</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  value <= (hoveredRating || rating)
                    ? "fill-primary text-primary"
                    : "fill-none text-gray-300"
                } transition-colors duration-200`}
              />
            </button>
          ))}
        </div>
        {rating === 0 && (
          <p className="text-sm text-destructive">Veuillez sélectionner une note</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Votre commentaire
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce vendeur..."
          className="min-h-[100px] resize-none"
          required
        />
        <p className="text-xs text-muted-foreground">
          {comment.length}/500 caractères
        </p>
      </div>

      <Button 
        type="submit" 
        disabled={rating === 0 || comment.length < 10 || comment.length > 500 || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Publication en cours..." : "Publier l'avis"}
      </Button>
    </form>
  );
}