import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/integrations/supabase/types/listing";

export function VipListings() {
  const { data: vipListings = [], isLoading, error } = useQuery({
    queryKey: ['vip-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .eq('is_vip', true)
        .gt('vip_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(6); // Limitons à 6 annonces VIP pour améliorer les performances

      if (error) throw error;
      return data as Listing[];
    },
    staleTime: 1000 * 60 * 5, // Cache pendant 5 minutes
    cacheTime: 1000 * 60 * 30, // Garde en cache pendant 30 minutes
  });

  if (error) {
    return null; // Ne pas afficher d'erreur pour ne pas perturber l'interface
  }

  if (isLoading || !vipListings.length) {
    return null;
  }

  return (
    <section className="space-y-6 mb-8">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold gradient-text">
          Annonces VIP
        </h2>
        <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
          Premium
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vipListings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}