import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import DOMPurify from 'dompurify';
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const isMobile = useIsMobile();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = DOMPurify.sanitize(rawValue).trim();
    setQuery(sanitizedValue);
    onSearch(sanitizedValue);
  };

  return (
    <div className="relative group px-4 sm:px-0">
      <Search className={`
        absolute left-7 sm:left-3 top-1/2 transform -translate-y-1/2 
        ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}
        text-gray-400 group-hover:text-primary transition-colors duration-200
      `} />
      <Input
        className={`
          pl-12 sm:pl-10 pr-4 
          ${isMobile ? 'h-14 text-lg' : 'h-12 text-base'}
          w-full rounded-full bg-white/80 backdrop-blur-sm 
          border border-gray-200 hover:border-primary/50 
          focus:border-primary transition-all duration-200 
          shadow-sm hover:shadow-md
        `}
        placeholder="Rechercher une annonce..."
        value={query}
        onChange={handleSearch}
        maxLength={100}
        aria-label="Rechercher une annonce"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}