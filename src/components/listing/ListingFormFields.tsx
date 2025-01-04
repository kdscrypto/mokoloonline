import { BasicInfoFields } from "./BasicInfoFields";
import { ContactFields } from "./ContactFields";
import { ImageUploadField } from "./ImageUploadField";
import { ListingTypeSelector } from "./ListingTypeSelector";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListingFormData } from "@/hooks/useListingForm";

interface ListingFormFieldsProps {
  formData: ListingFormData;
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
  return (
    <>
      <BasicInfoFields
        title={formData.title}
        category={formData.category}
        price={formData.price}
        location={formData.location}
        handleInputChange={handleInputChange}
        handleCategoryChange={handleCategoryChange}
      />
      
      <ListingTypeSelector
        isVip={formData.isVip}
        onVipChange={handleVipChange}
      />

      <ContactFields
        phone={formData.phone}
        whatsapp={formData.whatsapp}
        handleInputChange={handleInputChange}
      />
      
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
          minLength={10}
          maxLength={2000}
        />
      </div>
      
      <ImageUploadField
        image={formData.image}
        handleImageChange={handleImageChange}
      />
    </>
  );
}