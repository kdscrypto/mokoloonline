import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { VipListings } from "@/components/VipListings";
import { RegularListings } from "@/components/RegularListings";
import { usePerformanceMonitoring } from "@/utils/performance-monitor";
import { Header } from "@/components/header/Header";
import { GoogleAd } from "@/components/ads/GoogleAd";

const ITEMS_PER_PAGE = 12;

export default function Index() {
  usePerformanceMonitoring("home");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-secondary/5">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-10">
            <Header />
            
            <div className="space-y-8">
              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <CategoryFilter onCategoryChange={setSelectedCategory} />
            </div>

            {/* Publicité horizontale en haut */}
            <div className="w-full flex justify-center my-4">
              <GoogleAd 
                slot="1234567890" 
                className="w-full max-w-4xl h-[90px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
              />
            </div>

            <VipListings />
            
            {/* Publicité carrée sur le côté */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <RegularListings 
                  selectedCategory={selectedCategory}
                  searchQuery={searchQuery}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                />
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-4">
                  <GoogleAd 
                    slot="0987654321" 
                    className="w-[300px] h-[600px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <StatsBar />
        <Testimonials />
      </div>
      
      {/* Publicité horizontale en bas */}
      <div className="w-full flex justify-center my-8">
        <GoogleAd 
          slot="5432109876" 
          className="w-full max-w-4xl h-[90px] bg-white/80 backdrop-blur-sm rounded-lg shadow-sm"
        />
      </div>
      
      <Footer />
    </div>
  );
}