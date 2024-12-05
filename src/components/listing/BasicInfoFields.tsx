import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = [
  "Véhicules",
  "Immobilier",
  "Électronique",
  "Mode",
  "Services",
  "Emploi",
  "Autres",
];

interface BasicInfoFieldsProps {
  title: string;
  category: string;
  price: string;
  location: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCategoryChange: (value: string) => void;
}

export function BasicInfoFields({
  title,
  category,
  price,
  location,
  handleInputChange,
  handleCategoryChange,
}: BasicInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'annonce</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: iPhone 12 Pro Max - Excellent état"
          value={title}
          onChange={handleInputChange}
          required
          minLength={3}
          maxLength={100}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={category}
          onValueChange={handleCategoryChange}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Prix (FCFA)</Label>
        <Input
          id="price"
          name="price"
          type="number"
          placeholder="Ex: 350000"
          value={price}
          onChange={handleInputChange}
          required
          min="0"
          max="999999999"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          name="location"
          placeholder="Ex: Douala, Littoral"
          value={location}
          onChange={handleInputChange}
          required
          minLength={2}
          maxLength={100}
        />
      </div>
    </>
  );
}