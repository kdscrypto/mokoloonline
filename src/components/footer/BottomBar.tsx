import { Heart } from "lucide-react";

export function BottomBar() {
  return (
    <div className="border-t border-border/40 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Mokolo Online. Tous droits réservés.</p>
        <p className="text-muted-foreground flex items-center gap-1">
          Built with <Heart size={14} className="text-primary fill-primary" /> By KDS
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors duration-200">
            Conditions d'utilisation
          </a>
          <a href="#" className="hover:text-primary transition-colors duration-200">
            Politique de confidentialité
          </a>
        </div>
      </div>
    </div>
  );
}