import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthChangeEvent } from "@supabase/supabase-js";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginForm } from "./LoginForm";
import { SignUpForm } from "./SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

export function AuthForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message?.includes('JWT')) {
            await supabase.auth.signOut();
          }
          throw sessionError;
        }

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("Error checking profile:", profileError);
            if (profileError.message?.includes('JWT')) {
              await supabase.auth.signOut();
            }
            return;
          }

          if (profile?.username) {
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session) {
        setIsProcessing(true);
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            throw profileError;
          }

          if (profile?.username) {
            toast.success("Connexion réussie");
            navigate("/dashboard");
          }
        } catch (error: any) {
          console.error("Error checking profile:", error);
          toast.error("Erreur lors de la vérification du profil");
          if (error.message?.includes('JWT')) {
            await supabase.auth.signOut();
          }
        } finally {
          if (mounted) {
            setIsProcessing(false);
          }
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted) {
          setIsLoading(false);
          setIsProcessing(false);
          navigate("/auth");
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingIndicator size="lg" />
          <p className="mt-4 text-sm text-gray-500">Chargement en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto p-6 relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <LoadingIndicator size="sm" />
          </div>
        )}
        <Tabs defaultValue="login" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm isLoading={isProcessing} setIsLoading={setIsProcessing} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm isLoading={isProcessing} setIsLoading={setIsProcessing} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}