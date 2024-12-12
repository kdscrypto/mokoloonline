import { z } from "zod";

export const phoneSchema = z.string().regex(/^\+?[0-9\s-]{8,}$/, {
  message: "Numéro de téléphone invalide"
});

export const listingSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().min(0).max(999999999),
  location: z.string().min(2).max(100),
  category: z.string(),
  phone: phoneSchema.optional(),
  whatsapp: phoneSchema.optional(),
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  phone: phoneSchema.optional(),
  username: z.string().min(3).max(50).optional(),
});