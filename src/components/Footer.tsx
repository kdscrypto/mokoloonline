import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-secondary/20 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Mokolo Online</h3>
            <p className="text-muted-foreground">
              La première plateforme de petites annonces au Cameroun.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary">À propos</a></li>
              <li><a href="#" className="hover:text-primary">Comment ça marche</a></li>
              <li><a href="#" className="hover:text-primary">Sécurité</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Catégories</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Véhicules</a></li>
              <li><a href="#" className="hover:text-primary">Immobilier</a></li>
              <li><a href="#" className="hover:text-primary">Électronique</a></li>
              <li><a href="#" className="hover:text-primary">Services</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Suivez-nous</h4>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Mokolo Online. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}