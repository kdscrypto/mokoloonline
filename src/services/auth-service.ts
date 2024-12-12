import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/error-handler";
import { toast } from "sonner";

export async function checkSession() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return { session, profile };
  } catch (error) {
    await handleError(error, 'checkSession');
    return null;
  }
}

export async function signOut() {
  try {
    await supabase.auth.signOut();
    toast.success("Déconnexion réussie");
    window.location.href = '/';
  } catch (error) {
    await handleError(error, 'signOut');
  }
}