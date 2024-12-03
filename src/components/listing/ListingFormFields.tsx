import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus } from "lucide-react";

const categories = [
  "Véhicules",
  "Immobilier",
  "Électronique",
  "Mode",
  "Services",
  "Emploi",
  "Autres",
];

interface ListingFormFieldsProps {
  formData: {
    title: string;
    price: string;
    location: string;
    description: string;
    category: string;
    phone: string;
    whatsapp: string;
    image: File | null;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ListingFormFields({
  formData,
  handleInputChange,
  handleCategoryChange,
  handleImageChange,
}: ListingFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'annonce</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: iPhone 12 Pro Max - Excellent état"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category}
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
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Localisation</Label>
        <Input
          id="location"
          name="location"
          placeholder="Ex: Douala, Littoral"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ex: +237 6XX XX XX XX"
          value={formData.phone}
          onChange={handleInputChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="Ex: +237 6XX XX XX XX"
          value={formData.whatsapp}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Décrivez votre article en détail..."
          className="h-32"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Photos</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              Cliquez ou glissez-déposez vos photos ici
            </p>
            {formData.image && (
              <p className="mt-2 text-sm text-green-500">
                Image sélectionnée: {formData.image.name}
              </p>
            )}
          </label>
        </div>
      </div>
    </>
  );
}