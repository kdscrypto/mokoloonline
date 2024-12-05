import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="hover:bg-gray-100"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>
      <h1 className="text-2xl font-bold">Administration des annonces</h1>
    </div>
  );
};