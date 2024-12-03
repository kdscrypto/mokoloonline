import { Button } from "@/components/ui/button";

const categories = [
  "Tous",
  "Véhicules",
  "Immobilier",
  "Électronique",
  "Mode",
  "Services",
];

export function CategoryFilter() {
  return (
    <div className="relative w-full">
      <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide snap-x snap-mandatory">
        {categories.map((category) => (
          <Button
            key={category}
            variant="outline"
            className="whitespace-nowrap rounded-full snap-start shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}