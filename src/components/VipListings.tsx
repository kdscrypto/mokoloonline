import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/integrations/supabase/types/listing";

export function VipListings() {
  const { data: vipListings = [], isLoading } = useQuery({
    queryKey: ['vip-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .eq('is_vip', true)
        .gt('vip_until', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Listing[];
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (vipListings.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 mb-8">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Annonces VIP
        </h2>
        <span className="px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
          Premium
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vipListings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}