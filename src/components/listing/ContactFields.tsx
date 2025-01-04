import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactFieldsProps {
  phone: string;
  whatsapp: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactFields({
  phone,
  whatsapp,
  handleInputChange,
}: ContactFieldsProps) {
  const formatPhoneNumber = (value: string) => {
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
        name: e.target.name
      }
    };
    handleInputChange(syntheticEvent);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ex: 6XX XX XX XX"
          value={phone}
          onChange={handlePhoneChange}
        />
        <p className="text-sm text-gray-500">
          L'indicatif +237 sera ajouté automatiquement
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="Ex: 6XX XX XX XX"
          value={whatsapp}
          onChange={handlePhoneChange}
        />
        <p className="text-sm text-gray-500">
          L'indicatif +237 sera ajouté automatiquement
        </p>
      </div>
    </>
  );
}