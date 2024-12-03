import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function Index() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">MarketCam</h1>
          <Link to="/create">
            <Button className="rounded-full">
              <Plus className="mr-2 h-4 w-4" /> Publier une annonce
            </Button>
          </Link>
        </div>
        
        <SearchBar />
        <CategoryFilter />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      </div>
    </div>
  );
}