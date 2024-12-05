import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Listing } from "@/integrations/supabase/types/listing";
import type { ListingStatus } from "@/integrations/supabase/types/listing-status";
import { addDays } from "date-fns";

export const useAdminListings = (isAdmin: boolean) => {
  const { data: listings = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-listings'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching listings:", error);
        throw error;
      }

      return data as Listing[];
    },
    enabled: isAdmin,
    retry: 1,
    meta: {
      errorMessage: "Erreur lors du chargement des annonces"
    }
  });

  const handleStatusUpdate = async (id: string, newStatus: ListingStatus, vipDuration?: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }

      const { data: listing, error: fetchError } = await supabase
        .from("listings")
        .select("status")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error fetching listing:", fetchError);
        toast.error("Erreur lors de la vérification de l'annonce");
        return;
      }

      if (!listing) {
        toast.error("Annonce introuvable");
        return;
      }

      const vip_until = vipDuration ? addDays(new Date(), vipDuration).toISOString() : null;

      const { error: updateError } = await supabase
        .from("listings")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString(),
          is_vip: !!vipDuration,
          vip_until
        })
        .eq("id", id);

      if (updateError) {
        console.error("Status update error:", updateError);
        toast.error("Erreur lors de la mise à jour du statut");
        return;
      }

      const message = vipDuration 
        ? `Annonce approuvée en tant que VIP pour ${vipDuration} jours`
        : newStatus === 'approved' 
          ? "Annonce approuvée" 
          : "Annonce rejetée";
      
      toast.success(message);
      await refetch();
    } catch (error) {
      console.error("Error in handleStatusUpdate:", error);
      toast.error("Une erreur est survenue lors de la mise à jour");
    }
  };

  return { listings, isLoading, handleStatusUpdate };
};