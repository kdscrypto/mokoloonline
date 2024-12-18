import { ListingsTable } from "@/components/dashboard/ListingsTable";
import { ListingsFilters } from "@/components/dashboard/ListingsFilters";
import type { Listing } from "@/integrations/supabase/types/listing";

interface DashboardContentProps {
  listings: Listing[];
  searchQuery: string;
  statusFilter: string;
  sortOrder: "asc" | "desc";
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  onDelete: (id: string) => void;
}

export function DashboardContent({
  listings,
  searchQuery,
  statusFilter,
  sortOrder,
  setSearchQuery,
  setStatusFilter,
  setSortOrder,
  onDelete
}: DashboardContentProps) {
  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Mes annonces</h2>
        
        <ListingsFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        <ListingsTable listings={filteredListings} onDelete={onDelete} />
      </div>
    </div>
  );
}