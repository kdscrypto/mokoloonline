import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown } from "lucide-react";

interface ListingTypeSelectorProps {
  isVip: boolean;
  onVipChange: (value: boolean) => void;
}

export function ListingTypeSelector({ isVip, onVipChange }: ListingTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Type d'annonce</Label>
      <RadioGroup
        defaultValue={isVip ? "vip" : "normal"}
        onValueChange={(value) => onVipChange(value === "vip")}
        className="flex flex-col space-y-3"
      >
        <div className="flex items-center space-x-3 rounded-lg border p-4">
          <RadioGroupItem value="normal" id="normal" />
          <Label htmlFor="normal" className="flex-1 cursor-pointer">
            <div className="font-semibold">Annonce Standard</div>
            <div className="text-sm text-muted-foreground">
              Visibilité normale dans les résultats de recherche
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-3 rounded-lg border border-primary bg-primary/5 p-4">
          <RadioGroupItem value="vip" id="vip" />
          <Label htmlFor="vip" className="flex-1 cursor-pointer">
            <div className="font-semibold flex items-center gap-2">
              Annonce VIP
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              Apparaît en haut de la page pour une visibilité maximale
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}