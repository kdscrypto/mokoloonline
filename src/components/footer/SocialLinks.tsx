import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Button } from "../ui/button";

export function SocialLinks() {
  const socialLinks = [
    { icon: Facebook, label: "Facebook" },
    { icon: Twitter, label: "Twitter" },
    { icon: Instagram, label: "Instagram" },
    { icon: Youtube, label: "Youtube" }
  ];

  return (
    <div className="flex gap-4 pt-4">
      {socialLinks.map(({ icon: Icon, label }) => (
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
  );
}