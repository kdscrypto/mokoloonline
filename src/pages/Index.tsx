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

            <VipListings />
            
            <RegularListings 
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>

        <StatsBar />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}