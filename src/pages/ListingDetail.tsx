import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, MapPin } from "lucide-react";

export default function ListingDetail() {
  // Données de test
  const listing = {
    id: "1",
    title: "iPhone 12 Pro Max - Excellent état",
    price: 350000,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    location: "Douala, Littoral",
    description: "iPhone 12 Pro Max en excellent état, débloqué tout opérateur. Vendu avec chargeur et boîte d'origine. Batterie à 89% de santé.",
    seller: "Jean Paul",
    phone: "+237 6XX XX XX XX"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div>
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span className="text-gray-500">{listing.location}</span>
            </div>
            
            <span className="price-tag w-fit">
              {listing.price.toLocaleString()} FCFA
            </span>
            
            <p className="text-gray-600">{listing.description}</p>
            
            <div className="mt-auto">
              <h3 className="font-semibold mb-2">Vendeur: {listing.seller}</h3>
              <Button className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Voir le numéro
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}