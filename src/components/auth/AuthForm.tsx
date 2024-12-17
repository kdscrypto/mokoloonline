import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export const AuthForm = () => {
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
              password_input_placeholder: 'Choisissez un mot de passe',
              link_text: 'Pas encore de compte ? Inscrivez-vous',
            },
            forgotten_password: {
              button_label: 'Envoyer les instructions',
              link_text: 'Mot de passe oublié ?',
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