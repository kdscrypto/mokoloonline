import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Auth() {
  const navigate = useNavigate();
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Erreur lors de la vérification du profil:', profileError);
          toast.error("Une erreur est survenue lors de la création de votre profil");
          return;
        }

        if (profile && profile.username) {
          toast.success("Connexion réussie !");
          navigate("/dashboard");
        } else {
          setShowProfileForm(true);
        }
      } else if (event === 'SIGNED_OUT') {
        navigate("/auth");
      } else if (event === 'PASSWORD_RECOVERY') {
        toast.info("Vérifiez vos emails pour réinitialiser votre mot de passe");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Erreur d'authentification");
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: profileData.username,
        full_name: profileData.full_name,
        city: profileData.city,
        phone: profileData.phone,
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Erreur lors de la mise à jour du profil");
      return;
    }

    toast.success("Profil créé avec succès !");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center mb-6">
          <Link to="/" className="flex items-center text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Connexion / Inscription
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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
      </div>
    </div>
  );
}