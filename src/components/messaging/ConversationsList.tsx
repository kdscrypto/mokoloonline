import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
          initiator:profiles!conversations_initiator_id_fkey(username, full_name, avatar_url),
          recipient:profiles!conversations_recipient_id_fkey(username, full_name, avatar_url),
          messages:messages(id, created_at, read)
        `)
        .or(`initiator_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Écouter les mises à jour en temps réel des conversations et messages
  useEffect(() => {
    const channel = supabase
      .channel('conversations-updates')
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
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

  const getOtherParticipant = (conversation: any) => {
    const { data: { user } } = supabase.auth.getUser();
    return conversation.initiator_id === user?.id ? conversation.recipient : conversation.initiator;
  };

  const getUnreadCount = (conversation: any) => {
    const { data: { user } } = supabase.auth.getUser();
    return conversation.messages?.filter(
      (m: any) => !m.read && m.sender_id !== user?.id
    ).length || 0;
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-muted">
        <h2 className="font-semibold">Conversations</h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="space-y-1">
          {conversations.map((conversation: any) => {
            const otherParticipant = getOtherParticipant(conversation);
            const unreadCount = getUnreadCount(conversation);
            
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                  selectedConversationId === conversation.id ? "bg-accent" : ""
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">
                      {conversation.listing?.title || "Annonce supprimée"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(conversation.updated_at), 'dd MMM HH:mm', { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      Avec: {otherParticipant?.username || otherParticipant?.full_name || "Utilisateur supprimé"}
                    </p>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {conversation.status === "active" ? (
                      <Badge variant="success" className="px-2 py-1 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="px-2 py-1 text-xs">
                        Terminée
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}