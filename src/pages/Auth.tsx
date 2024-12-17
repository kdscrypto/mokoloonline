import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AuthForm } from "@/components/auth/AuthForm";
import { ProfileForm } from "@/components/auth/ProfileForm";

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
          {showProfileForm ? "Complétez votre profil" : "Connexion / Inscription"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {showProfileForm ? (
          <ProfileForm profileData={profileData} setProfileData={setProfileData} />
        ) : (
          <AuthForm />
        )}
      </div>
    </div>
  );
}