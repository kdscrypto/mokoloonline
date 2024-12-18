import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SecurityGuidelinesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SecurityGuidelines({ isOpen, onOpenChange }: SecurityGuidelinesProps) {
  const securityTips = [
    "Ne payez jamais à l'avance sans avoir vu l'article",
    "Privilégiez les rencontres dans des lieux publics",
    "Méfiez-vous des prix anormalement bas",
    "Ne communiquez jamais vos informations bancaires",
    "En cas de doute, contactez notre équipe de support",
    "Toujours inspecter scrupuleusement l'état du produit avant de finaliser la transaction financière",
    "Pour tout achat d'appareil ou de machine, insistez sur la remise de la facture par le vendeur",
    "En cas de location immobilière, procédez au paiement du loyer directement au propriétaire en obtenant une décharge signée confirmant la réception de votre paiement, accompagnée du numéro de carte d'identité. Conservez une copie de ce document",
    "Les frais d'agence, tels que les visites et les commissions, sont les seuls montants à régler à l'agent immobilier"
  ];

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Consignes de sécurité</h3>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? "Masquer" : "Afficher"}
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-4">
        <div className="grid gap-4 text-sm">
          {securityTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t">
          <Link to="/security">
            <Button variant="link" className="p-0">
              En savoir plus sur nos mesures de sécurité
            </Button>
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}