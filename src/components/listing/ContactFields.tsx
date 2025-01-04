import { PhoneInput } from "@/components/ui/phone-input";

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
      <PhoneInput
        id="phone"
        name="phone"
        label="Numéro de téléphone"
        value={phone}
        onChange={handleInputChange}
      />

      <PhoneInput
        id="whatsapp"
        name="whatsapp"
        label="Numéro WhatsApp"
        value={whatsapp}
        onChange={handleInputChange}
      />
    </>
  );
}