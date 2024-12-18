import { ListingCard } from "../ListingCard";
import { ListingsPagination } from "../ListingsPagination";
import type { Listing } from "@/integrations/supabase/types/listing";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface AllListingsProps {
  listings: Listing[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function AllListings({ listings, currentPage, totalPages, onPageChange }: AllListingsProps) {
  // Group listings by category
  const listingsByCategory = listings.reduce((acc, listing) => {
    if (!acc[listing.category]) {
      acc[listing.category] = [];
    }
    acc[listing.category].push(listing);
    return acc;
  }, {} as Record<string, Listing[]>);

  // Track open/closed state for each category
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    // Initialize all categories as open by default
    return Object.keys(listingsByCategory).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {} as Record<string, boolean>);
  });

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <section className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Toutes les annonces
        </h2>
        <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
      </div>

      {Object.entries(listingsByCategory).map(([category, categoryListings]) => (
        <Collapsible 
          key={category} 
          open={openCategories[category]}
          onOpenChange={() => toggleCategory(category)}
        >
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-medium text-gray-800">
                  {category}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {categoryListings.length}
                </span>
              </div>
              {openCategories[category] ? (
                <ChevronUp className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
              )}
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryListings.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      <ListingsPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </section>
  );
}