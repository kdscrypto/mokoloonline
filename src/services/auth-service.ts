import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/error-handler";
import { toast } from "sonner";

export async function checkSession() {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error("Erreur de session:", sessionError);
      throw new Error("Impossible de vérifier votre session");
    }

    if (!session) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error("Erreur lors de la récupération du profil:", profileError);
      return { session, profile: null };
    }

    return { session, profile };
  } catch (error) {
    await handleError(error, 'checkSession');
    return null;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw new Error("Impossible de vous déconnecter");
    }
    
    toast.success("Déconnexion réussie", {
      description: "À bientôt !"
    });
    
    window.location.href = '/';
  } catch (error) {
    await handleError(error, 'signOut');
  }
}