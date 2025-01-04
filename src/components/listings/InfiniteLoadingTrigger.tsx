import { ListingsLoadingState } from "./ListingsLoadingState";

interface InfiniteLoadingTriggerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  observerRef: (node?: Element | null) => void;
}

export function InfiniteLoadingTrigger({
  hasNextPage,
  isFetchingNextPage,
  observerRef
}: InfiniteLoadingTriggerProps) {
  if (!hasNextPage) return null;

  return (
    <div ref={observerRef} className="flex justify-center py-4">
      {isFetchingNextPage ? (
        <ListingsLoadingState />
      ) : (
        <div className="h-20" />
      )}
    </div>
  );
}