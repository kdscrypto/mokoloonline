import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { phoneSchema } from "@/utils/phone-utils";

const listingSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Le prix doit être un nombre positif"),
  location: z.string().min(2, "La localisation doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  phone: phoneSchema,
  whatsapp: phoneSchema,
});

export interface ListingFormData {
  title: string;
  price: string;
  location: string;
  description: string;
  category: string;
  phone: string;
  whatsapp: string;
  image: File | null;
  isVip: boolean;
  vipDuration: number;
}

export function useListingForm(initialData?: Partial<ListingFormData>) {
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    price: "",
    location: "",
    description: "",
    category: "",
    phone: "",
    whatsapp: "",
    image: null,
    isVip: false,
    vipDuration: 30,
    ...initialData
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' && value !== '') {
      const numValue = Number(value);
      if (isNaN(numValue) || numValue < 0) {
        toast.error("Le prix doit être un nombre positif");
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleVipChange = (value: { isVip: boolean, duration?: number }) => {
    setFormData(prev => ({
      ...prev,
      isVip: value.isVip,
      vipDuration: value.duration || prev.vipDuration
    }));
  };

  return {
    formData,
    setFormData,
    validateFormData,
    handleInputChange,
    handleCategoryChange,
    handleImageChange,
    handleVipChange,
  };
}