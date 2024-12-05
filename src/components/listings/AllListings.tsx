import { ListingCard } from "../ListingCard";
import { ListingsPagination } from "../ListingsPagination";
import type { Listing } from "@/integrations/supabase/types/listing";

interface AllListingsProps {
  listings: Listing[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AllListings({ listings, currentPage, totalPages, onPageChange }: AllListingsProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Toutes les annonces
        </h2>
        <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}
      </div>

      <ListingsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}