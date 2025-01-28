import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { useRef, useCallback, useEffect } from "react";
import { MapPin } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useIsMobile } from "@/hooks/use-mobile";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  image_url: string;
  location: string;
}

export function ListingCard({ id, title, price, image_url, location }: ListingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    // Handle resize if needed
  }, []);

  const observerRef = useResizeObserver(handleResize);

  useEffect(() => {
    if (cardRef.current && observerRef.current) {
      observerRef.current.observe(cardRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <Link to={`/listing/${id}`}>
      <Card 
        className={`listing-card overflow-hidden group ${
          isMobile ? 'w-full' : 'w-[280px]'
        }`} 
        ref={cardRef}
      >
        <CardContent className="p-0 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <OptimizedImage
            src={image_url || '/placeholder.svg'}
            alt={title}
            width={isMobile ? 400 : 280}
            height={isMobile ? 200 : 144}
            className="w-full h-48 sm:h-36 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 p-4 bg-white/90 backdrop-blur-sm">
          <h3 className="font-semibold text-lg sm:text-base line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 sm:h-3 sm:w-3" />
            <span className="text-sm sm:text-xs">{location}</span>
          </div>
          <span className="price-tag mt-2">
            {price.toLocaleString()} FCFA
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}