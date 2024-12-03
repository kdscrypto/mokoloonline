import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

const categories = [
  "Véhicules",
  "Immobilier",
  "Électronique",
  "Mode",
  "Services",
  "Emploi",
  "Autres",
];

// Add validation rules
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

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
  // Validate file upload
  const validateFileUpload = (file: File): string | null => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP.";
    }
    if (file.size > FILE_SIZE_LIMIT) {
      return "Fichier trop volumineux. Maximum 5MB.";
    }
    return null;
  };

  // Enhanced input validation
  const handleEnhancedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Sanitize and validate input
    let sanitizedValue = value.trim();
    
    // Specific validations
    if (name === 'price') {
      const numValue = Number(sanitizedValue);
      if (isNaN(numValue) || numValue < 0) {
        toast.error("Le prix doit être un nombre positif");
        return;
      }
    }
    
    if (name === 'phone' || name === 'whatsapp') {
      const phoneRegex = /^\+?[0-9\s-]{8,}$/;
      if (sanitizedValue && !phoneRegex.test(sanitizedValue)) {
        toast.error("Format de numéro de téléphone invalide");
        return;
      }
    }

    handleInputChange(e);
  };

  // Enhanced file handling
  const handleEnhancedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateFileUpload(file);
      if (error) {
        toast.error(error);
        e.target.value = '';
        return;
      }
    }
    handleImageChange(e);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titre de l'annonce</Label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: iPhone 12 Pro Max - Excellent état"
          value={formData.title}
          onChange={handleEnhancedInputChange}
          required
          minLength={3}
          maxLength={100}
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
          onChange={handleEnhancedInputChange}
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
          value={formData.location}
          onChange={handleEnhancedInputChange}
          required
          minLength={2}
          maxLength={100}
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
          onChange={handleEnhancedInputChange}
          pattern="^\+?[0-9\s-]{8,}$"
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
          onChange={handleEnhancedInputChange}
          pattern="^\+?[0-9\s-]{8,}$"
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
          onChange={handleEnhancedInputChange}
          required
          minLength={10}
          maxLength={2000}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Photos</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(',')}
            onChange={handleEnhancedImageChange}
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
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG ou WEBP - Max 5MB
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
