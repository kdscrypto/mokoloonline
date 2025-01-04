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
    // Supprime tous les caractères sauf les chiffres, les espaces, les tirets et le +
    const cleaned = value.replace(/[^\d\s+-]/g, '');
    
    // S'assure qu'il n'y a qu'un seul + au début
    const formatted = cleaned.replace(/^\++/, '+').replace(/\+(?=.+\+)/g, '');
    
    // Si le numéro commence par +237, on le garde tel quel
    if (formatted.startsWith('+237')) {
      return formatted;
    }
    
    // Si le numéro commence par 2, 3, 6 ou 8, on ajoute +237
    if (/^[2368]/.test(formatted)) {
      return '+237' + formatted;
    }
    
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    e.target.value = formattedValue;
    handleInputChange(e);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="Ex: +237 6XX XX XX XX"
          value={phone}
          onChange={handlePhoneChange}
        />
        <p className="text-sm text-gray-500">
          Format: +237 suivi de 9 chiffres (ex: +237 655 55 55 55)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">Numéro WhatsApp</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          placeholder="Ex: +237 6XX XX XX XX"
          value={whatsapp}
          onChange={handlePhoneChange}
        />
        <p className="text-sm text-gray-500">
          Format: +237 suivi de 9 chiffres (ex: +237 655 55 55 55)
        </p>
      </div>
    </>
  );
}