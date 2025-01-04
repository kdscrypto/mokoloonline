import { z } from "zod";

export const CAMEROON_PHONE_REGEX = /^\+237[2368]\d{8}$/;

export const phoneSchema = z.string().regex(
  CAMEROON_PHONE_REGEX,
  "Format invalide. Le numéro doit commencer par +237 suivi de 9 chiffres"
).optional();

export const formatPhoneNumber = (value: string) => {
  // Supprime tous les caractères sauf les chiffres
  const cleaned = value.replace(/[^\d]/g, '');
  
  // Si le numéro commence déjà par 237, on ajoute juste le +
  if (cleaned.startsWith('237')) {
    return '+' + cleaned;
  }
  
  // Si le numéro commence par 2, 3, 6 ou 8, on ajoute +237
  if (/^[2368]/.test(cleaned)) {
    return '+237' + cleaned;
  }
  
  // Pour tout autre cas, on retourne la valeur avec +237 si elle n'est pas vide
  return cleaned ? '+237' + cleaned : '';
};