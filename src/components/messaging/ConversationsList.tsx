import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { toast } from "sonner";

interface ConversationsListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationsList({ selectedConversationId, onSelectConversation }: ConversationsListProps) {
  const { data: conversations = [], refetch } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(title),
          initiator:profiles!conversations_initiator_id_fkey(username, full_name),
          recipient:profiles!conversations_recipient_id_fkey(username, full_name)
        `)
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Écouter les mises à jour en temps réel
  useEffect(() => {
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="space-y-1">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                selectedConversationId === conversation.id ? "bg-accent" : ""
              }`}
            >
              <div className="space-y-1">
                <p className="font-medium truncate">
                  {conversation.listing?.title || "Annonce supprimée"}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  Avec: {conversation.initiator?.username || conversation.initiator?.full_name || "Utilisateur supprimé"}
                </p>
                <div className="flex items-center gap-2">
                  {conversation.status === "active" ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                      Terminée
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}