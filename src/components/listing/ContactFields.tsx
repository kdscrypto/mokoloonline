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
    // Permet les chiffres, les espaces, les tirets et le + au début
    const cleaned = value.replace(/[^\d\s+-]/g, '');
    
    // S'assure qu'il n'y a qu'un seul + au début
    return cleaned.replace(/^\++/, '+').replace(/\+(?=.+\+)/g, '');
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
          pattern="^(\+237[\s-]?|)([2368]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})$"
          title="Entrez un numéro de téléphone camerounais valide (ex: +237 6XX XX XX XX)"
        />
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
          pattern="^(\+237[\s-]?|)([2368]\d{1}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})$"
          title="Entrez un numéro de téléphone camerounais valide (ex: +237 6XX XX XX XX)"
        />
      </div>
    </>
  );
}