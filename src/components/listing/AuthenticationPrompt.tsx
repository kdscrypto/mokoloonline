import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function AuthenticationPrompt() {
  return (
    <div className="mt-8 text-center space-y-4">
      <div className="p-6 bg-gray-50 rounded-lg">
        <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Connectez-vous pour voir les détails
        </h3>
        <p className="text-gray-600 mb-4">
          Pour voir le prix et contacter le vendeur, vous devez vous connecter ou créer un compte.
        </p>
        <Link to="/auth">
          <Button className="w-full">
            Se connecter / S'inscrire
          </Button>
        </Link>
      </div>
    </div>
  );
}