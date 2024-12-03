import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer 
      className="bg-gradient-to-b from-secondary/5 to-secondary/20 pt-16 pb-8 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('https://images.unsplash.com/photo-1605810230434-7631ac76ec81')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png" 
                alt="Mokolo Online Logo" 
                className="w-10 h-10"
              />
              <h3 className="font-bold text-xl">Mokolo Online</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              La première plateforme de petites annonces au Cameroun. Trouvez et publiez facilement des annonces.
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>contact@mokolo-online.com</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>+237 6XX XXX XXX</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Yaoundé, Cameroun</span>
            </div>
            <div className="flex gap-4 pt-4">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "Youtube" }
              ].map(({ icon: Icon, label }) => (
                <Button 
                  key={label}
                  variant="ghost" 
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Liens rapides</h4>
            <ul className="space-y-3">
              {["À propos", "Comment ça marche", "Sécurité", "Contact"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/60"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-lg mb-6">Catégories</h4>
            <ul className="space-y-3">
              {["Véhicules", "Immobilier", "Électronique", "Services", "Mode", "Emploi"].map((item) => (
                <li key={item}>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary/60"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Mokolo Online. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors duration-200">Conditions d'utilisation</a>
              <a href="#" className="hover:text-primary transition-colors duration-200">Politique de confidentialité</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
