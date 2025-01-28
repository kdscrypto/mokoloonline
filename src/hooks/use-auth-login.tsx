import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/utils/phone-utils";

export function useAuthLogin() {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordReset = async (identifier: string) => {
    try {
      if (!identifier) {
        toast.error("Veuillez saisir votre email");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(identifier, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      
      toast.success("Instructions envoyées", {
        description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe"
      });
      setIsResettingPassword(false);
    } catch (error: any) {
      console.error("Erreur de réinitialisation:", error);
      toast.error("Erreur lors de la réinitialisation", {
        description: error.message === "Email rate limit exceeded" 
          ? "Trop de tentatives. Veuillez réessayer plus tard."
          : "Vérifiez que l'email est correct"
      });
    }
  };

  const handlePhoneLogin = async (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', formattedPhone);

    if (profileError || !profiles || profiles.length === 0) {
      throw new Error("Numéro de téléphone non trouvé");
    }

    const profile = profiles[0];

    const { data: authData, error: authError } = await supabase
      .from('auth_users_view')
      .select('*')
      .eq('id', profile.id)
      .single();

    if (authError || !authData?.email) {
      throw new Error("Utilisateur non trouvé");
    }

    return authData.email;
  };

  const handleLogin = async (identifier: string, password: string) => {
    if (!identifier) {
      toast.error("Veuillez saisir votre email ou numéro de téléphone");
      return;
    }

    if (!password && !isResettingPassword) {
      toast.error("Veuillez saisir votre mot de passe");
      return;
    }

    try {
      if (isResettingPassword) {
        await handlePasswordReset(identifier);
        return;
      }

      const isPhone = identifier.includes("+237") || /^[2368]\d{8}$/.test(identifier);
      let email = identifier;
      
      if (isPhone) {
        try {
          email = await handlePhoneLogin(identifier);
        } catch (error: any) {
          toast.error("Erreur d'authentification", {
            description: "Numéro de téléphone non trouvé ou invalide"
          });
          return;
        }
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Identifiants invalides", {
            description: "Email/téléphone ou mot de passe incorrect"
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email non confirmé", {
            description: "Veuillez vérifier votre boîte mail pour confirmer votre compte"
          });
        } else {
          throw error;
        }
        return;
      }
      
      toast.success("Connexion réussie");
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast.error("Erreur lors de la connexion", {
        description: "Une erreur inattendue est survenue"
      });
    }
  };

  return {
    isResettingPassword,
    setIsResettingPassword,
    handleLogin
  };
}