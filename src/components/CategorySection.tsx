import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "./ListingCard";
import type { Listing } from "@/integrations/supabase/types/listing";

interface CategorySectionProps {
  category: string;
}

export function CategorySection({ category }: CategorySectionProps) {
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', category],
    queryFn: async () => {
      console.log(`Fetching listings for category: ${category}`);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        throw error;
      }
      return data as Listing[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900">{category}</h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}