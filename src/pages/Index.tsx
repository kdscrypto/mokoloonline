import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VipListings } from "@/components/VipListings";
import { RegularListings } from "@/components/RegularListings";
import { usePerformanceMonitoring } from "@/utils/performance-monitor";

const ITEMS_PER_PAGE = 12;

export default function Index() {
  usePerformanceMonitoring("home");

  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsAuthenticated(true);
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        setIsAdmin(!!adminData);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-secondary/5">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-10">
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