import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Plus, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { StatsBar } from "@/components/StatsBar";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

// Données de test
const listings = [
  {
    id: "1",
    title: "iPhone 12 Pro Max - Excellent état",
    price: 350000,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    location: "Douala, Littoral",
  },
  {
    id: "2",
    title: "Appartement 3 pièces - Bastos",
    price: 150000,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    location: "Yaoundé, Centre",
  },
  {
    id: "3",
    title: "Honda Civic 2019 - Automatique",
    price: 4500000,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    location: "Bafoussam, Ouest",
  },
];

const recentListings = listings.slice(0, 2);

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png" 
                  alt="Mokolo Online Logo" 
                  className="w-12 h-12"
                />
                <h1 className="text-3xl font-bold">Mokolo Online</h1>
              </div>
              <div className="flex items-center gap-4">
                <Link to="/auth">
                  <Button variant="outline" className="rounded-full">
                    <LogIn className="mr-2 h-4 w-4" /> Connexion
                  </Button>
                </Link>
                <Link to="/create">
                  <Button className="rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Publier une annonce
                  </Button>
                </Link>
              </div>
            </header>
            
            <SearchBar />
            <CategoryFilter />

            {/* Section des dernières annonces */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Nos dernières annonces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {recentListings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            </section>
            
            {/* Section principale des annonces */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Toutes les annonces</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} {...listing} />
                ))}
              </div>
            </section>
          </div>
        </div>

        <StatsBar />
        <Testimonials />
      </div>
      <Footer />
    </div>
  );
}