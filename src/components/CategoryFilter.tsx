import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const categories = [
  "Tous",
  "Véhicules",
  "Immobilier",
  "Électronique",
  "Mode",
  "Services",
  "Emploi",
];

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ onCategoryChange }: CategoryFilterProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full">
      <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide snap-x snap-mandatory px-4 sm:px-0">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className={`
              whitespace-nowrap rounded-full snap-start shrink-0 
              bg-white/80 backdrop-blur-sm hover:bg-primary/10 
              hover:text-primary transition-all duration-200 
              border-gray-200 hover:border-primary/50
              ${isMobile ? 'text-sm px-4 py-2' : ''}
            `}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}