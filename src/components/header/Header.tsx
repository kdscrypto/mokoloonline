import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthButtons } from "./AuthButtons";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

export const Header = () => {
  const { session } = useSession();
  const navigate = useNavigate();

  const handleCreateListing = () => {
    if (!session) {
      toast.error("Vous devez être connecté pour publier une annonce");
      navigate("/auth");
      return;
    }
    navigate("/create-listing");
  };

  return (
    <header 
      className="relative flex justify-between items-center rounded-2xl p-6 shadow-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 -z-10" />
      
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-20 rounded-full" />
            <img
              src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png"
              alt="Logo"
              className="w-10 h-10 relative z-10"
            />
          </div>
          <span className="text-xl font-bold gradient-text">Mokolo</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <AuthButtons />
        <Button 
          onClick={handleCreateListing}
          className="rounded-full hover:scale-105 transition-transform duration-300 shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" /> Publier une annonce
        </Button>
        <Link to="/about" className="ml-4">
          <Button variant="ghost" className="rounded-full">
            À propos
          </Button>
        </Link>
      </div>
    </header>
  );
};