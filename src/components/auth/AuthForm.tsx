import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { useSession } from "@/hooks/use-session";
import { useProfile } from "@/hooks/use-profile";
import { ProfileForm } from "./ProfileForm";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { session, isLoading: sessionLoading } = useSession();
  const { profile, isLoading: profileLoading } = useProfile();
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    city: "",
    phone: "",
  });

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  if (session && !profile?.username) {
    return <ProfileForm profileData={profileData} setProfileData={setProfileData} />;
  }

  return (
    <div className="space-y-6">
      {isLogin ? (
        <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
      ) : (
        <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
      )}
      
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
        disabled={isLoading}
      >
        {isLogin ? "Créer un compte" : "Déjà inscrit ?"}
      </button>
    </div>
  );
}