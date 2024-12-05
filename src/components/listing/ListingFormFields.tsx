import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BasicInfoFields } from "./BasicInfoFields";
import { ContactFields } from "./ContactFields";
import { ImageUploadField } from "./ImageUploadField";
import { ListingTypeSelector } from "./ListingTypeSelector";

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