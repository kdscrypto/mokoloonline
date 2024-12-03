import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import DOMPurify from 'dompurify';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Sanitize input to prevent XSS
    const sanitizedValue = DOMPurify.sanitize(rawValue).trim();
    setQuery(sanitizedValue);
    onSearch(sanitizedValue);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        className="pl-10 pr-4 h-12 w-full rounded-full"
        placeholder="Rechercher une annonce..."
        value={query}
        onChange={handleSearch}
        maxLength={100}
        aria-label="Rechercher une annonce"
      />
    </div>
  );
}