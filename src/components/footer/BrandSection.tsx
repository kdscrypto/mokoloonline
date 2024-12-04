import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { SocialLinks } from "./SocialLinks";

export function BrandSection() {
  return (
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
      <ContactInfo />
      <SocialLinks />
    </div>
  );
}

function ContactInfo() {
  return (
    <>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Mail className="h-4 w-4" />
        <span>237mokoloonline@proton.me</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Phone className="h-4 w-4" />
        <span>+237 670 381 624</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>Yaoundé, Cameroun</span>
      </div>
    </>
  );
}