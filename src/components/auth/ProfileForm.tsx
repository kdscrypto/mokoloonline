import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileData {
  username: string;
  full_name: string;
  city: string;
  phone: string;
}

interface ProfileFormProps {
  profileData: ProfileData;
  setProfileData: React.Dispatch<React.SetStateAction<ProfileData>>;
}

export const ProfileForm = ({ profileData, setProfileData }: ProfileFormProps) => {
  const navigate = useNavigate();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        throw new Error("Erreur d'authentification");
      }

      if (!user) {
        toast.error("Vous devez être connecté pour mettre à jour votre profil");
        navigate("/auth");
        return;
      }

      // Vérification des champs requis
      if (!profileData.username || !profileData.full_name || !profileData.city || !profileData.phone) {
        toast.error("Veuillez remplir tous les champs");
        return;
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: profileData.username,
          full_name: profileData.full_name,
          city: profileData.city,
          phone: profileData.phone,
        })
        .eq('id', user.id);

      if (updateError) {
        if (updateError.code === '23505') {
          toast.error("Ce nom d'utilisateur est déjà pris");
        } else {
          throw updateError;
        }
        return;
      }

      toast.success("Profil créé avec succès !");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error(error.message || "Une erreur est survenue lors de la mise à jour du profil");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Complétez votre profil
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                required
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="full_name">Nom complet</Label>
              <Input
                id="full_name"
                type="text"
                required
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="city">Ville de résidence</Label>
              <Input
                id="city"
                type="text"
                required
                value={profileData.city}
                onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="mt-1"
                placeholder="+237 6XX XX XX XX"
              />
            </div>

            <Button type="submit" className="w-full">
              Créer mon profil
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};