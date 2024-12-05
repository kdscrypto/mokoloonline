import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "./ListingCard";
import { ListingsPagination } from "./ListingsPagination";
import type { Listing } from "@/integrations/supabase/types/listing";

interface RegularListingsProps {
  selectedCategory: string;
  searchQuery: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
}

export function RegularListings({
  selectedCategory,
  searchQuery,
  currentPage,
  setCurrentPage,
  itemsPerPage
}: RegularListingsProps) {
  const { data: paginatedData, isLoading, error } = useQuery({
    queryKey: ['listings', selectedCategory, searchQuery, currentPage],
    queryFn: async () => {
      console.log('Début de la requête Regular listings avec params:', { selectedCategory, searchQuery, currentPage, itemsPerPage });
      
      let query = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')
        .eq('is_vip', false)
        .order('created_at', { ascending: false });

      if (selectedCategory !== "Tous") {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      // Ajout de la pagination
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      const { data, count, error } = await query;
      
      if (error) {
        console.error("Erreur lors de la récupération des listings:", error);
        throw error;
      }

      console.log('Regular listings récupérés:', { data, count });
      
      return { listings: data as Listing[], total: count || 0 };
    },
  });

  if (error) {
    console.error("Erreur dans le composant RegularListings:", error);
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Une erreur est survenue lors du chargement des annonces</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Chargement des annonces...</p>
      </div>
    );
  }

  if (!paginatedData?.listings.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucune annonce trouvée</p>
      </div>
    );
  }

  const totalPages = Math.ceil((paginatedData.total || 0) / itemsPerPage);

  return (
    <div className="space-y-12">
      {/* Section Dernières Annonces */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dernières annonces
          </h2>
          <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.listings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </section>

      {/* Section Toutes les Annonces */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Toutes les annonces
          </h2>
          <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedData.listings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>

        <ListingsPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}