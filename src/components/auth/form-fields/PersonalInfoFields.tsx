import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PersonalInfoFieldsProps {
  username: string;
  fullName: string;
  phone: string;
  setUsername: (value: string) => void;
  setFullName: (value: string) => void;
  setPhone: (value: string) => void;
  isLoading: boolean;
}

export function PersonalInfoFields({
  username,
  fullName,
  phone,
  setUsername,
  setFullName,
  setPhone,
  isLoading,
}: PersonalInfoFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="Votre nom d'utilisateur"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Votre nom complet"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="Votre numéro de téléphone"
          disabled={isLoading}
        />
      </div>
    </>
  );
}