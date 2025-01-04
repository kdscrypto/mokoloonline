import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { formatPhoneNumber } from "@/utils/phone-utils";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function LoginForm({ isLoading, setIsLoading }: LoginFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Veuillez saisir votre email ou numéro de téléphone");
      return;
    }

    setIsLoading(true);

    try {
      if (isResettingPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });

        if (error) throw error;
        
        toast.success("Instructions envoyées", {
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe"
        });
        setIsResettingPassword(false);
      } else {
        if (!password) {
          toast.error("Veuillez saisir votre mot de passe");
          return;
        }

        // Détermine si l'identifiant est un email ou un numéro de téléphone
        const isPhone = identifier.includes("+237") || /^[2368]\d{8}$/.test(identifier);
        let email = identifier;
        
        if (isPhone) {
          // Formate le numéro de téléphone
          const formattedPhone = formatPhoneNumber(identifier);
          
          // Récupère l'email associé au numéro de téléphone
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('phone', formattedPhone)
            .single();

          if (profileError || !profile) {
            throw new Error("Numéro de téléphone non trouvé");
          }

          // Récupère l'utilisateur via son id
          const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(
            profile.id
          );

          if (userError || !user) {
            throw new Error("Utilisateur non trouvé");
          }

          email = user.email;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast.error(error.message || "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email ou numéro de téléphone</Label>
        <Input
          id="identifier"
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          placeholder="votre@email.com ou +237 6XX XX XX XX"
          disabled={isLoading}
          className="transition-all duration-200"
        />
      </div>

      {!isResettingPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            disabled={isLoading}
            minLength={6}
            className="transition-all duration-200"
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full relative" 
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <LoadingIndicator size="sm" className="mr-2" />
            Chargement...
          </span>
        ) : (
          isResettingPassword 
            ? "Envoyer les instructions"
            : "Se connecter"
        )}
      </Button>

      <button
        type="button"
        onClick={() => setIsResettingPassword(!isResettingPassword)}
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 w-full text-center transition-colors duration-200"
        disabled={isLoading}
      >
        {isResettingPassword 
          ? "Retour à la connexion" 
          : "Mot de passe oublié ?"
        }
      </button>
    </form>
  );
}