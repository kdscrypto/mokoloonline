import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Listing } from "@/integrations/supabase/types/listing";
import { ListingsLoadingState } from "./listings/ListingsLoadingState";
import { ListingsErrorState } from "./listings/ListingsErrorState";
import { ListingsEmptyState } from "./listings/ListingsEmptyState";
import { LatestListings } from "./listings/LatestListings";
import { AllListings } from "./listings/AllListings";

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
    return <ListingsErrorState />;
  }

  if (isLoading) {
    return <ListingsLoadingState />;
  }

  if (!paginatedData?.listings.length) {
    return <ListingsEmptyState />;
  }

  const totalPages = Math.ceil((paginatedData.total || 0) / itemsPerPage);

  return (
    <div className="space-y-12">
      <LatestListings listings={paginatedData.listings} />
      <AllListings 
        listings={paginatedData.listings}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}