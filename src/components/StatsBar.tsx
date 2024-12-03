import { Users, ShoppingBag, BadgeCheck, MessageSquare } from "lucide-react";

export function StatsBar() {
  return (
    <div className="w-full bg-primary/5 py-12">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col items-center">
          <Users className="h-8 w-8 text-primary mb-2" />
          <span className="text-3xl font-bold">1,234</span>
          <span className="text-muted-foreground">Utilisateurs inscrits</span>
        </div>
        <div className="flex flex-col items-center">
          <ShoppingBag className="h-8 w-8 text-primary mb-2" />
          <span className="text-3xl font-bold">5,678</span>
          <span className="text-muted-foreground">Annonces publiées</span>
        </div>
        <div className="flex flex-col items-center">
          <BadgeCheck className="h-8 w-8 text-primary mb-2" />
          <span className="text-3xl font-bold">890</span>
          <span className="text-muted-foreground">Vendeurs vérifiés</span>
        </div>
        <div className="flex flex-col items-center">
          <MessageSquare className="h-8 w-8 text-primary mb-2" />
          <span className="text-3xl font-bold">15K+</span>
          <span className="text-muted-foreground">Avis clients</span>
        </div>
      </div>
    </div>
  );
}