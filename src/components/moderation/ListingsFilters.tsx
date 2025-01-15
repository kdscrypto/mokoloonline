import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ListingsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function ListingsFilters({
  searchQuery,
  setSearchQuery,
}: ListingsFiltersProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        placeholder="Rechercher par titre ou localisation..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}