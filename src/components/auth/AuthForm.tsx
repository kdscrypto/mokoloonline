import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { useSession } from "@/hooks/use-session";
import { useProfile } from "@/hooks/use-profile";
import { ProfileForm } from "./ProfileForm";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const { session, isLoading: sessionLoading } = useSession();
  const { profile, isLoading: profileLoading } = useProfile();

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingIndicator size="lg" />
      </div>
    );
  }

  if (session && !profile?.username) {
    return <ProfileForm />;
  }

  return (
    <div className="space-y-6">
      {isLogin ? (
        <LoginForm />
      ) : (
        <SignUpForm isLoading={false} setIsLoading={() => {}} />
      )}
      
      <button
        type="button"
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        {isLogin ? "Créer un compte" : "Déjà inscrit ?"}
      </button>
    </div>
  );
}