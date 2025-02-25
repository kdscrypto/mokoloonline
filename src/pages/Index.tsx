
import * as React from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { usePerformanceMonitoring } from "@/utils/performance/performance-monitor";
import { GoogleAd } from "@/components/ads/GoogleAd";
import { Helmet } from "react-helmet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Suspense } from "react";
import { HomeContent } from "@/components/home/HomeContent";
import { ListingsLoadingState } from "@/components/listings/ListingsLoadingState";

const ITEMS_PER_PAGE = 12;

const Index: React.FC = () => {
  usePerformanceMonitoring("home");
  const [selectedCategory, setSelectedCategory] = React.useState("Tous");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const isMobile = useIsMobile();

  const handleCategoryChange = (category: string) => {
    startTransition(() => {
      setSelectedCategory(category);
    });
  };

  const handleSearch = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Mokolo Online - Petites Annonces au Cameroun</title>
        <meta 
          name="description" 
          content="Découvrez la première plateforme de petites annonces au Cameroun. Achetez et vendez facilement dans toutes les catégories." 
        />
        <link rel="canonical" href="https://mokolo.online" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-white to-secondary/5">
        <main className="w-full">
          <div className="max-w-[2000px] mx-auto py-4 sm:py-8">
            <section aria-label="Recherche et filtres" className="space-y-6 sm:space-y-8">
              <div className="max-w-2xl mx-auto w-full">
                <SearchBar onSearch={handleSearch} />
              </div>
              <CategoryFilter onCategoryChange={handleCategoryChange} />
            </section>

            <Suspense fallback={<ListingsLoadingState />}>
              <HomeContent
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                itemsPerPage={isMobile ? 6 : ITEMS_PER_PAGE}
              />
            </Suspense>
          </div>

          <StatsBar />
          <Testimonials />
        </main>
        
        <section aria-label="Publicité bas de page" className="w-full flex justify-center my-8">
          <GoogleAd 
            slot="5432109876" 
            className="w-full max-w-4xl h-[90px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm mx-4 sm:mx-0"
          />
        </section>
        
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Index;
