import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { ConversationHeader } from "./ConversationHeader";
import { MessagesContainer } from "./MessagesContainer";
import { MessageInput } from "./MessageInput";

interface ConversationViewProps {
  conversationId: string;
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          *,
          listing:listings(title),
          initiator:profiles!conversations_initiator_id_fkey(username, full_name),
          recipient:profiles!conversations_recipient_id_fkey(username, full_name)
        `)
        .eq('id', conversationId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles(username, full_name)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        () => {
          refetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, refetchMessages]);

  if (!conversation) return null;

  return (
    <div className="border rounded-lg overflow-hidden h-[600px] flex flex-col">
      <ConversationHeader conversation={conversation} />
      <MessagesContainer messages={messages} conversation={conversation} />
      {conversation.status === "active" && (
        <MessageInput 
          conversationId={conversationId}
          onMessageSent={refetchMessages}
        />
      )}
    </div>
  );
}