import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { toast } from "sonner";

export const AuthForm = () => {
  useEffect(() => {
    // Écouter les erreurs d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "USER_DELETED") {
        toast.error("Le compte a été supprimé");
      }
      if (event === "PASSWORD_RECOVERY") {
        toast.info("Vérifiez vos emails pour réinitialiser votre mot de passe");
      }
      if (event === "SIGNED_OUT") {
        toast.success("Déconnexion réussie");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
      <SupabaseAuth 
        supabaseClient={supabase} 
        appearance={{ 
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#000000',
                brandAccent: '#666666',
              },
            },
          },
        }}
        providers={[]}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email',
              password_label: 'Mot de passe',
              button_label: 'Se connecter',
              email_input_placeholder: 'Votre email',
              password_input_placeholder: 'Votre mot de passe',
              link_text: 'Déjà inscrit ? Connectez-vous',
            },
            sign_up: {
              email_label: 'Email',
              password_label: 'Mot de passe',
              button_label: "S'inscrire",
              email_input_placeholder: 'Votre email',
              password_input_placeholder: 'Choisissez un mot de passe (minimum 6 caractères)',
              link_text: 'Pas encore de compte ? Inscrivez-vous',
            },
            forgotten_password: {
              button_label: 'Envoyer les instructions',
              link_text: 'Mot de passe oublié ?',
              email_label: 'Email',
              email_input_placeholder: 'Votre email',
            },
          },
        }}
        theme="light"
        view="sign_in"
        showLinks={true}
      />
    </Card>
  );
};