import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatPhoneNumber } from "@/utils/phone-utils";

export function useAuthLogin() {
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const handlePasswordReset = async (identifier: string) => {
    try {
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
      toast.error(error.message || "Erreur lors de la réinitialisation");
    }
  };

  const handlePhoneLogin = async (phone: string) => {
    const formattedPhone = formatPhoneNumber(phone);
    
    // Look up the user's profile using the phone number
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', formattedPhone);

    if (profileError || !profiles || profiles.length === 0) {
      throw new Error("Numéro de téléphone non trouvé");
    }

    // Get the first matching profile
    const profile = profiles[0];

    // Get the user's auth details using their profile ID
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

      // Détermine si l'identifiant est un email ou un numéro de téléphone
      const isPhone = identifier.includes("+237") || /^[2368]\d{8}$/.test(identifier);
      let email = identifier;
      
      if (isPhone) {
        email = await handlePhoneLogin(identifier);
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Connexion réussie");
    } catch (error: any) {
      console.error("Erreur d'authentification:", error);
      toast.error(error.message || "Erreur lors de la connexion");
      throw error; // Re-throw to let the component handle the loading state
    }
  };

  return {
    isResettingPassword,
    setIsResettingPassword,
    handleLogin
  };
}