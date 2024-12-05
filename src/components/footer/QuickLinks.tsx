import { Link } from "react-router-dom";
import { ContactDialog } from "../contact/ContactDialog";

export function QuickLinks() {
  const links = [
    { label: "À propos", to: "/about" },
    { label: "Comment ça marche", to: "/how-it-works" },
    { label: "Sécurité", to: "/security" }
  ];

  return (
    <div>
      <h4 className="font-bold text-lg mb-6">Liens rapides</h4>
      <ul className="space-y-3">
        {links.map((item) => (
          <li key={item.label}>
            <Link 
              to={item.to}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 flex items-center gap-2"
            >
              <span className="h-1 w-1 rounded-full bg-primary/60"></span>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <ContactDialog />
        </li>
      </ul>
    </div>
  );
}