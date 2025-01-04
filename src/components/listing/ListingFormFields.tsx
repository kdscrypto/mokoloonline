import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BasicInfoFields } from "./BasicInfoFields";
import { ContactFields } from "./ContactFields";
import { ImageUploadField } from "./ImageUploadField";
import { ListingTypeSelector } from "./ListingTypeSelector";
import { z } from "zod";

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const phoneRegex = /^\+237[2368]\d{8}$/;

const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Le prix doit être un nombre positif"),
  location: z.string().min(2, "La localisation doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  phone: z.string().regex(phoneRegex, "Format invalide. Utilisez le format +237 suivi de 9 chiffres").optional(),
  whatsapp: z.string().regex(phoneRegex, "Format invalide. Utilisez le format +237 suivi de 9 chiffres").optional(),
});

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
    isVip: boolean;
    vipDuration?: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCategoryChange: (value: string) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVipChange: (value: { isVip: boolean, duration?: number }) => void;
}

export function ListingFormFields({
  formData,
  handleInputChange,
  handleCategoryChange,
  handleImageChange,
  handleVipChange,
}: ListingFormFieldsProps) {
  const validateFormData = () => {
    try {
      listingSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      }
      return false;
    }
  };

  const validateFileUpload = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP.");
      return false;
    }
    if (file.size > FILE_SIZE_LIMIT) {
      toast.error("Fichier trop volumineux. Maximum 5MB.");
      return false;
    }
    return true;
  };

  const handleEnhancedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' && value !== '') {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        toast.error("Le prix doit être un nombre positif");
        return;
      }
    }
    
    if ((name === 'phone' || name === 'whatsapp') && value !== '') {
      const phoneRegex = /^\+?[0-9\s-]{8,}$/;
      if (!phoneRegex.test(value)) {
        toast.error("Format de numéro de téléphone invalide");
        return;
      }
    }

    handleInputChange(e);
  };

  const handleEnhancedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFileUpload(file)) {
      handleImageChange(e);
    } else {
      e.target.value = '';
    }
  };

  return (
    <>
      <BasicInfoFields
        title={formData.title}
        category={formData.category}
        price={formData.price}
        location={formData.location}
        handleInputChange={handleEnhancedInputChange}
        handleCategoryChange={handleCategoryChange}
      />
      
      <ListingTypeSelector
        isVip={formData.isVip}
        onVipChange={handleVipChange}
      />

      <ContactFields
        phone={formData.phone}
        whatsapp={formData.whatsapp}
        handleInputChange={handleEnhancedInputChange}
      />
      
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
      
      <ImageUploadField
        image={formData.image}
        handleImageChange={handleEnhancedImageChange}
      />
    </>
  );
}