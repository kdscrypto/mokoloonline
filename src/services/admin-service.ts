import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function removeAdminRights(userId: string) {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('user_id', userId);

  if (error) {
    toast.error("Erreur lors de la suppression des droits administrateur");
    throw error;
  }

  toast.success("Droits administrateur supprimés avec succès");
}