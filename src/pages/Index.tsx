import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { CategorySection } from "@/components/CategorySection";
import { usePerformanceMonitoring } from "@/utils/performance-monitor";
import type { Listing } from "@/integrations/supabase/types/listing";

const categories = [
  "Véhicules",
  "Immobilier",
  "Électronique",
  "Mode",
  "Services",
  "Emploi",
];

export default function Index() {
  usePerformanceMonitoring("home");

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      }
    };

    checkAdminStatus();
  }, []);

  // Query for all approved listings
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['listings', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Listing[];
    },
  });

  // Filter and group listings by category
  const filteredListings = selectedCategory === "Tous" 
    ? listings 
    : listings.filter(listing => listing.category === selectedCategory);

  const listingsByCategory = categories.reduce((acc, category) => {
    acc[category] = listings.filter(listing => listing.category === category);
    return acc;
  }, {} as Record<string, Listing[]>);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-secondary/5">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-10">
            {/* Header section */}
            <header className="flex justify-between items-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png" 
                    alt="Mokolo Online Logo" 
                    className="w-14 h-14 object-contain"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Mokolo Online
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    La marketplace camerounaise
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link to="/admin">
                        <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
                          <Settings className="mr-2 h-4 w-4" /> Administration
                        </Button>
                      </Link>
                    )}
                    <Link to="/dashboard">
                      <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
                        <Settings className="mr-2 h-4 w-4" /> Tableau de bord
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" className="rounded-full hover:shadow-md transition-all duration-300">
                      <LogIn className="mr-2 h-4 w-4" /> Connexion
                    </Button>
                  </Link>
                )}
                <Link to="/create">
                  <Button className="rounded-full hover:scale-105 transition-transform duration-300 shadow-lg">
                    <Plus className="mr-2 h-4 w-4" /> Publier une annonce
                  </Button>
                </Link>
                <Link to="/about" className="ml-4">
                  <Button variant="ghost" className="rounded-full">
                    À propos
                  </Button>
                </Link>
              </div>
            </header>
            
            {/* Search and filter section */}
            <div className="space-y-8">
              <div className="max-w-2xl mx-auto">
                <SearchBar onSearch={setSearchQuery} />
              </div>
              <CategoryFilter onCategoryChange={setSelectedCategory} />
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Chargement des annonces...</p>
              </div>
            ) : (
              <div className="space-y-16">
                {selectedCategory === "Tous" ? (
                  // Display all categories when no specific category is selected
                  categories.map((category) => (
                    <CategorySection
                      key={category}
                      title={category}
                      listings={listingsByCategory[category]}
                    />
                  ))
                ) : (
                  // Display only the selected category
                  <CategorySection
                    title={selectedCategory}
                    listings={filteredListings}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <StatsBar />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}
