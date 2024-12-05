import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Crown } from "lucide-react";

interface ListingTypeSelectorProps {
  isVip: boolean;
  onVipChange: (value: { isVip: boolean, duration?: number }) => void;
}

export function ListingTypeSelector({ isVip, onVipChange }: ListingTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Type d'annonce</Label>
      <RadioGroup
        defaultValue={isVip ? "vip-30" : "normal"}
        onValueChange={(value) => {
          if (value === "normal") {
            onVipChange({ isVip: false });
          } else {
            const duration = parseInt(value.split("-")[1]);
            onVipChange({ isVip: true, duration });
          }
        }}
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
          <RadioGroupItem value="vip-7" id="vip-7" />
          <Label htmlFor="vip-7" className="flex-1 cursor-pointer">
            <div className="font-semibold flex items-center gap-2">
              Annonce VIP - 7 jours
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              Apparaît en haut de la page pour une visibilité maximale pendant 7 jours
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 rounded-lg border border-primary bg-primary/5 p-4">
          <RadioGroupItem value="vip-14" id="vip-14" />
          <Label htmlFor="vip-14" className="flex-1 cursor-pointer">
            <div className="font-semibold flex items-center gap-2">
              Annonce VIP - 14 jours
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              Apparaît en haut de la page pour une visibilité maximale pendant 14 jours
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-3 rounded-lg border border-primary bg-primary/5 p-4">
          <RadioGroupItem value="vip-30" id="vip-30" />
          <Label htmlFor="vip-30" className="flex-1 cursor-pointer">
            <div className="font-semibold flex items-center gap-2">
              Annonce VIP - 30 jours
              <Crown className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">
              Apparaît en haut de la page pour une visibilité maximale pendant 30 jours
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}