import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ConversationHeaderProps {
  conversation: any;
}

export function ConversationHeader({ conversation }: ConversationHeaderProps) {
  const markAsComplete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('conversations')
        .update({ status: 'completed' })
        .eq('id', conversation.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Conversation marquée comme terminée");
    },
    onError: (error) => {
      toast.error("Erreur lors de la mise à jour du statut", {
        description: error.message
      });
    },
  });

  return (
    <div className="p-4 border-b bg-muted">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{conversation.listing?.title || "Annonce supprimée"}</h2>
          <p className="text-sm text-muted-foreground">
            Avec: {conversation.initiator?.username || conversation.initiator?.full_name || "Utilisateur supprimé"}
          </p>
        </div>
        {conversation.status === "active" && (
          <Button
            variant="outline"
            onClick={() => markAsComplete.mutate()}
            disabled={markAsComplete.isPending}
          >
            Marquer comme terminée
          </Button>
        )}
      </div>
    </div>
  );
}