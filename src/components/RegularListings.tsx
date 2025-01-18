import React from 'react';
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ListingsLoadingState } from "./listings/ListingsLoadingState";
import { ListingsErrorState } from "./listings/ListingsErrorState";
import { ListingsEmptyState } from "./listings/ListingsEmptyState";
import { LatestListings } from "./listings/LatestListings";
import { AllListings } from "./listings/AllListings";
import { useListingsQuery } from "@/hooks/use-listings-query";
import { InfiniteLoadingTrigger } from "./listings/InfiniteLoadingTrigger";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { toast } from "sonner";

interface RegularListingsProps {
  selectedCategory: string;
  searchQuery: string;
  itemsPerPage: number;
}

export const RegularListings: React.FC<RegularListingsProps> = ({
  selectedCategory,
  searchQuery,
  itemsPerPage
}) => {
  const { ref, inView } = useInView();
  const { isRateLimited, queueDelay, isFallback } = useRateLimit();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useListingsQuery({
    selectedCategory,
    searchQuery,
    itemsPerPage
  });

  useEffect(() => {
    if (isRateLimited) {
      toast.error("Trop de requêtes", {
        description: "Veuillez patienter quelques minutes avant de réessayer."
      });
      return;
    }

    if (queueDelay > 0) {
      toast.info("Trafic élevé", {
        description: `Votre requête est en file d'attente (${queueDelay}ms)`
      });
    }

    if (isFallback) {
      toast.warning("Mode dégradé", {
        description: "Le service fonctionne en mode limité"
      });
    }

    if (inView && hasNextPage && !isFetchingNextPage && !isRateLimited) {
      const timeout = setTimeout(() => {
        fetchNextPage();
      }, queueDelay);

      return () => clearTimeout(timeout);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isRateLimited, queueDelay, isFallback]);

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
      
      <InfiniteLoadingTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        observerRef={ref}
      />
    </div>
  );
};