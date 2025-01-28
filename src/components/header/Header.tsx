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
    <header 
      className="relative flex justify-between items-center rounded-2xl p-6 shadow-lg overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 -z-10" />
      
      <div className="flex items-center gap-4 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-primary blur-lg opacity-20 rounded-full" />
            <img
              src="/lovable-uploads/e3b929be-d96d-4470-869a-739d4e330db4.png"
              alt="Logo"
              className="w-10 h-10 relative z-10"
            />
          </div>
          <span className="text-xl font-bold gradient-text">Mokolo Online</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide px-2 py-1 -mx-2 relative z-10">
        <div className="flex items-center gap-4 min-w-max">
          <AuthButtons />
          <Button 
            onClick={handleCreateListing}
            className="rounded-full hover:scale-105 transition-transform duration-300 shadow-lg whitespace-nowrap"
            size="sm"
            disabled={isLoading}
          >
            <Plus className="mr-2 h-3 w-3" /> Publier une annonce
          </Button>
          <Link to="/about" className="ml-4">
            <Button variant="ghost" size="sm" className="rounded-full whitespace-nowrap">
              À propos
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};