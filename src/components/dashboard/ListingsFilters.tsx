import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ListingsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export function ListingsFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder,
}: ListingsFiltersProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Rechercher par titre ou localisation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrer par statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="approved">Approuvées</SelectItem>
          <SelectItem value="rejected">Rejetées</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Trier par date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Plus récentes</SelectItem>
          <SelectItem value="asc">Plus anciennes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}