import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { ListingsLoadingState } from "./listings/ListingsLoadingState";
import { ListingsErrorState } from "./listings/ListingsErrorState";
import { ListingsEmptyState } from "./listings/ListingsEmptyState";
import { LatestListings } from "./listings/LatestListings";
import { AllListings } from "./listings/AllListings";
import { useListingsQuery } from "@/hooks/use-listings-query";
import { InfiniteLoadingTrigger } from "./listings/InfiniteLoadingTrigger";

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
  } = useListingsQuery({
    selectedCategory,
    searchQuery,
    itemsPerPage
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
      
      <InfiniteLoadingTrigger
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        observerRef={ref}
      />
    </div>
  );
}