import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ListingsPagination } from "@/components/ListingsPagination";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const ITEMS_PER_PAGE = 12;

export default function Index() {
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
      }
    };

    checkAdminStatus();
  }, []);

  // Query for paginated listings
  const { data: paginatedData, isLoading } = useQuery({
    queryKey: ['listings', selectedCategory, searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

      if (selectedCategory !== "Tous") {
        query = query.eq('category', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, count, error } = await query;
      if (error) throw error;
      return { listings: data, total: count || 0 };
    },
  });

  const totalPages = Math.ceil((paginatedData?.total || 0) / ITEMS_PER_PAGE);

  const { data: latestListings = [] } = useQuery({
    queryKey: ['latest-listings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data;
    },
  });

  const autoplayPlugin = Autoplay({ delay: 4000, stopOnInteraction: false });

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
              </div>
            </header>
            
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
              <>
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Nos dernières annonces
                    </h2>
                    <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
                  </div>
                  <Carousel
                    plugins={[autoplayPlugin]}
                    className="w-full"
                    opts={{
                      align: "start",
                      loop: true,
                    }}
                  >
                    <CarouselContent>
                      {latestListings.map((listing) => (
                        <CarouselItem key={listing.id} className="md:basis-1/2">
                          <ListingCard {...listing} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </section>
                
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      Toutes les annonces
                    </h2>
                    <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-primary/20 to-transparent rounded-full" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedData?.listings.map((listing) => (
                      <ListingCard key={listing.id} {...listing} />
                    ))}
                  </div>

                  <ListingsPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </section>
              </>
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
