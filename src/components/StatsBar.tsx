import { Users, ShoppingBag, BadgeCheck, MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function StatsBar() {
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-primary/5 py-8 sm:py-12">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6">
        {[
          { icon: Users, label: "Utilisateurs inscrits", value: "1,234" },
          { icon: ShoppingBag, label: "Annonces publiées", value: "5,678" },
          { icon: BadgeCheck, label: "Vendeurs vérifiés", value: "890" },
          { icon: MessageSquare, label: "Avis clients", value: "15K+" }
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex flex-col items-center text-center">
            <Icon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary mb-2`} />
            <span className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>{value}</span>
            <span className="text-muted-foreground text-sm sm:text-base">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}