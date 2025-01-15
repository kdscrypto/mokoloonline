import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ModerationPanel } from "@/components/moderation/ModerationPanel";
import { toast } from "sonner";

export default function Moderation() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkModeratorAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Accès non autorisé");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from('moderators')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (error || !data) {
        toast.error("Accès réservé aux modérateurs");
        navigate("/");
        return;
      }
    };

    checkModeratorAccess();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ModerationPanel />
    </div>
  );
}