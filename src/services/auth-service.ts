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
    // First check if we still have a valid session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // If no session exists, just redirect to home
      toast.success("Déconnexion réussie");
      window.location.href = '/';
      return;
    }
    
    // Attempt to sign out
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      // If we get a session_not_found error, the session is already invalid
      // so we can just redirect to home
      if (error.message?.includes('session_not_found')) {
        toast.success("Déconnexion réussie");
        window.location.href = '/';
        return;
      }
      console.error("Erreur lors de la déconnexion:", error);
      throw new Error("Impossible de vous déconnecter");
    }
    
    toast.success("Déconnexion réussie", {
      description: "À bientôt !"
    });
    
    // Use window.location.href for a complete page reload
    window.location.href = '/';
  } catch (error) {
    await handleError(error, 'signOut');
  }
}