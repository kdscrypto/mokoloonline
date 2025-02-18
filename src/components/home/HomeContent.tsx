
import * as React from "react";
import { VipListings } from "@/components/VipListings";
import { RegularListings } from "@/components/RegularListings";
import { GoogleAd } from "@/components/ads/GoogleAd";
import { ListingsLoadingState } from "@/components/listings/ListingsLoadingState";
import { Suspense } from "react";

interface HomeContentProps {
  selectedCategory: string;
  searchQuery: string;
  itemsPerPage: number;
}

export function HomeContent({ selectedCategory, searchQuery, itemsPerPage }: HomeContentProps) {
  return (
    <div className="flex flex-col gap-6 sm:gap-10">
      <section aria-label="Publicité" className="w-full flex justify-center my-4">
        <GoogleAd 
          slot="1234567890" 
          className="w-full max-w-4xl h-[90px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm mx-4 sm:mx-0"
        />
      </section>

      <section aria-label="Annonces VIP" className="px-4 sm:px-6">
        <Suspense fallback={<ListingsLoadingState />}>
          <VipListings />
        </Suspense>
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6">
        <section aria-label="Toutes les annonces" className="lg:col-span-3">
          <Suspense fallback={<ListingsLoadingState />}>
            <RegularListings 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              itemsPerPage={itemsPerPage}
            />
          </Suspense>
        </section>
        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <GoogleAd 
              slot="0987654321" 
              className="w-[300px] h-[600px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
