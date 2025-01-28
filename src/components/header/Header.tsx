import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthButtons } from "./AuthButtons";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";

export const Header = () => {
  const { session, isLoading } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateListing = () => {
    if (isLoading) {
      return;
    }

    console.log("Create listing clicked - Session state:", { 
      isLoading, 
      hasSession: !!session,
      userId: session?.user?.id,
      currentPath: location.pathname,
      timestamp: new Date().toISOString()
    });

    if (!session?.user) {
      toast.error("Vous devez être connecté pour publier une annonce");
      navigate("/auth", { state: { from: "/create-listing" } });
      return;
    }

    navigate("/create-listing");
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full animate-pulse" />
              <img
                src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png"
                alt="Logo"
                className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-lg font-bold gradient-text hidden sm:inline">
              Mokolo Online
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <AuthButtons />
            <Button 
              onClick={handleCreateListing}
              className="whitespace-nowrap"
              size="sm"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-3 w-3" /> Publier
            </Button>
            <Link to="/about">
              <Button variant="ghost" size="sm" className="whitespace-nowrap">
                À propos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};