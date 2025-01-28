import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

interface ConversationViewProps {
  conversationId: string;
}

export function ConversationView({ conversationId }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
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

  const sendMessage = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: newMessage,
        });

      if (error) throw error;
      
      // Mettre à jour la date de mise à jour de la conversation
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi du message", {
        description: error.message
      });
    },
  });

  const markAsComplete = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('conversations')
        .update({ status: 'completed' })
        .eq('id', conversationId);

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

  // Écouter les nouveaux messages en temps réel
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

  // Scroll automatique vers le bas lors de nouveaux messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    sendMessage.mutate();
  };

  if (!conversation) return null;

  return (
    <div className="border rounded-lg overflow-hidden h-[600px] flex flex-col">
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

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.sender?.username === conversation.initiator?.username
                  ? "items-start"
                  : "items-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender?.username === conversation.initiator?.username
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {new Date(message.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {conversation.status === "active" && (
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="flex-1"
              rows={1}
            />
            <Button type="submit" disabled={sendMessage.isPending}>
              Envoyer
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}