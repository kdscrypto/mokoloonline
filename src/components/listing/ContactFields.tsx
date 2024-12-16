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
    // Remove all non-digit characters except + sign
    const cleaned = value.replace(/[^\d+]/g, '');
    // Ensure only one + at the start
    return cleaned.replace(/^\++/, '+');
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
          pattern="^\+?[0-9]{8,}$"
          title="Entrez un numéro de téléphone valide (minimum 8 chiffres)"
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
          pattern="^\+?[0-9]{8,}$"
          title="Entrez un numéro de téléphone valide (minimum 8 chiffres)"
        />
      </div>
    </>
  );
}