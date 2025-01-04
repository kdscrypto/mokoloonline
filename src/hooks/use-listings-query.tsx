import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Listing } from "@/integrations/supabase/types/listing";

interface ListingsResponse {
  listings: Listing[];
  total: number;
  nextPage: number | undefined;
}

interface UseListingsQueryProps {
  selectedCategory: string;
  searchQuery: string;
  itemsPerPage: number;
}

export function useListingsQuery({ 
  selectedCategory, 
  searchQuery, 
  itemsPerPage 
}: UseListingsQueryProps) {
  return useInfiniteQuery<ListingsResponse>({
    queryKey: ['listings', selectedCategory, searchQuery],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      console.log('Début de la requête Regular listings avec params:', { 
        selectedCategory, 
        searchQuery, 
        pageParam, 
        itemsPerPage 
      });
      
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

      const start = Number(pageParam) * itemsPerPage;
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
        nextPage: data.length === itemsPerPage ? Number(pageParam) + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}