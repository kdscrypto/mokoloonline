import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/integrations/supabase/types/listing";

interface CategorySectionProps {
  title: string;
  listings: Listing[];
}

export function CategorySection({ title, listings }: CategorySectionProps) {
  if (listings.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title}
        </h2>
        <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>
    </section>
  );
}