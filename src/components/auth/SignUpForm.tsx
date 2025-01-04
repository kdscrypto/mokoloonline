import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { EmailField } from "./form-fields/EmailField";
import { PasswordFields } from "./form-fields/PasswordFields";
import { PersonalInfoFields } from "./form-fields/PersonalInfoFields";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface SignUpFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SignUpForm({ isLoading, setIsLoading }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const validateForm = () => {
    if (!email || !password || !confirmPassword || !username || !fullName || !phone) {
      toast.error("Veuillez remplir tous les champs");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            username,
            full_name: fullName,
            phone,
          }
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            username,
            full_name: fullName,
            phone,
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast.success("Vérifiez votre email pour confirmer votre inscription");
      }
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      <EmailField 
        email={email}
        setEmail={setEmail}
        isLoading={isLoading}
      />

      <PasswordFields
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        isLoading={isLoading}
      />

      <PersonalInfoFields
        username={username}
        fullName={fullName}
        phone={phone}
        setUsername={setUsername}
        setFullName={setFullName}
        setPhone={setPhone}
        isLoading={isLoading}
      />

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
          "Créer un compte"
        )}
      </Button>
    </form>
  );
}