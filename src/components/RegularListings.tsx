import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
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
  itemsPerPage: number;
}

export function RegularListings({
  selectedCategory,
  searchQuery,
  itemsPerPage
}: RegularListingsProps) {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['listings', selectedCategory, searchQuery],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Début de la requête Regular listings avec params:', { selectedCategory, searchQuery, pageParam, itemsPerPage });
      
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

      const start = pageParam * itemsPerPage;
      const end = start + itemsPerPage - 1;
      query = query.range(start, end);

      const { data, count, error } = await query;
      
      if (error) {
        console.error("Erreur lors de la récupération des listings:", error);
        throw error;
      }

      console.log('Regular listings récupérés:', { data, count });
      return {
        listings: data as Listing[],
        total: count || 0,
        nextPage: data.length === itemsPerPage ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return <ListingsErrorState />;
  }

  if (isLoading) {
    return <ListingsLoadingState />;
  }

  const listings = data?.pages.flatMap(page => page.listings) || [];

  if (!listings.length) {
    return <ListingsEmptyState />;
  }

  return (
    <div className="space-y-12">
      <LatestListings listings={listings.slice(0, itemsPerPage)} />
      <AllListings listings={listings} />
      
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage ? (
            <ListingsLoadingState />
          ) : (
            <div className="h-20" /> // Espace pour déclencher le chargement
          )}
        </div>
      )}
    </div>
  );
}