import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { useAuthLogin } from "@/hooks/use-auth-login";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { 
    isLoading, 
    isResettingPassword, 
    setIsResettingPassword, 
    handleLogin 
  } = useAuthLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(identifier, password);
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