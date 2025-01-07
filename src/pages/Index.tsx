import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { VipListings } from "@/components/VipListings";
import { RegularListings } from "@/components/RegularListings";
import { usePerformanceMonitoring } from "@/utils/performance/performance-monitor";
import { Header } from "@/components/header/Header";
import { GoogleAd } from "@/components/ads/GoogleAd";
import { Helmet } from "react-helmet";

const ITEMS_PER_PAGE = 12;

function Index() {
  usePerformanceMonitoring("home");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Helmet>
        <title>Mokolo Online - Petites Annonces au Cameroun</title>
        <meta name="description" content="Découvrez la première plateforme de petites annonces au Cameroun. Achetez et vendez facilement dans toutes les catégories." />
        <link rel="canonical" href="https://mokolo.online" />
      </Helmet>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-secondary/5">
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-10">
              <Header />
              
              <section aria-label="Recherche et filtres" className="space-y-8">
                <div className="max-w-2xl mx-auto">
                  <SearchBar onSearch={setSearchQuery} />
                </div>
                <CategoryFilter onCategoryChange={setSelectedCategory} />
              </section>

              <section aria-label="Publicité" className="w-full flex justify-center my-4">
                <GoogleAd 
                  slot="1234567890" 
                  className="w-full max-w-4xl h-[90px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
                />
              </section>

              <section aria-label="Annonces VIP">
                <VipListings />
              </section>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <section aria-label="Toutes les annonces" className="lg:col-span-3">
                  <RegularListings 
                    selectedCategory={selectedCategory}
                    searchQuery={searchQuery}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
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
          </div>

          <StatsBar />
          <Testimonials />
        </main>
        
        <section aria-label="Publicité bas de page" className="w-full flex justify-center my-8">
          <GoogleAd 
            slot="5432109876" 
            className="w-full max-w-4xl h-[90px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
          />
        </section>
        
        <Footer />
      </div>
    </>
  );
}

// Make sure to export the component as default
export default Index;