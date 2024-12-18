import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AuthForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (profile && profile.username) {
            navigate("/dashboard");
          }
        } catch (error: any) {
          console.error("Erreur lors de la vérification du profil:", error);
          toast.error("Erreur lors de la vérification du profil");
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (error) {
            throw error;
          }

          if (profile && profile.username) {
            toast.success("Connexion réussie");
            navigate("/dashboard");
          }
        } catch (error: any) {
          console.error("Erreur lors de la vérification du profil:", error);
          toast.error("Erreur lors de la vérification du profil");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6">
        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}