import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
}

export function EmailField({ email, setEmail, isLoading }: EmailFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="signup-email">Email</Label>
      <Input
        id="signup-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="votre@email.com"
        disabled={isLoading}
      />
    </div>
  );
}