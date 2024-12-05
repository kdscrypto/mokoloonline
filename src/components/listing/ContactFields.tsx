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
          onChange={handleInputChange}
          pattern="^\+?[0-9\s-]{8,}$"
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
          onChange={handleInputChange}
          pattern="^\+?[0-9\s-]{8,}$"
        />
      </div>
    </>
  );
}