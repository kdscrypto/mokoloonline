import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhoneNumber } from "@/utils/phone-utils";

interface PhoneInputProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PhoneInput({
  id,
  name,
  label,
  value,
  onChange,
}: PhoneInputProps) {
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
    onChange(syntheticEvent);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="tel"
        placeholder="Ex: 6XX XX XX XX"
        value={value}
        onChange={handlePhoneChange}
      />
      <p className="text-sm text-gray-500">
        L'indicatif +237 sera ajouté automatiquement
      </p>
    </div>
  );
}