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
    <div className="flex gap-2 overflow-x-auto py-4">
      {categories.map((category) => (
        <Button
          key={category}
          variant="outline"
          className="whitespace-nowrap rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}