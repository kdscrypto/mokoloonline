import { Facebook, Twitter, MessageCircle, Youtube } from "lucide-react";
import { Button } from "../ui/button";

export function SocialLinks() {
  const socialLinks = [
    { 
      icon: Facebook, 
      label: "Facebook",
      href: "https://www.facebook.com/share/1B9kjmAB1z/?mibextid=LQQJ4d"
    },
    { 
      icon: Twitter, 
      label: "Twitter",
      href: "https://x.com/BitcoinCamer?t=LpaC7RAVrGJ0cnMSAv31EQ&s=35"
    },
    { 
      icon: MessageCircle, 
      label: "Telegram",
      href: "https://t.me/mokoloonline"
    },
    { icon: Youtube, label: "Youtube" }
  ];

  return (
    <div className="flex gap-4 pt-4">
      {socialLinks.map(({ icon: Icon, label, href }) => (
        <Button 
          key={label}
          variant="ghost" 
          size="icon"
          className="hover:bg-primary/10 hover:text-primary transition-colors duration-200"
          onClick={() => href && window.open(href, '_blank')}
        >
          <Icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}