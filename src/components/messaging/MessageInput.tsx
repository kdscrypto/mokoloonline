import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface MessageInputProps {
  conversationId: string;
  onMessageSent: () => void;
}

export function MessageInput({ conversationId, onMessageSent }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState("");

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
      
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    },
    onSuccess: () => {
      setNewMessage("");
      onMessageSent();
    },
    onError: (error) => {
      toast.error("Erreur lors de l'envoi du message", {
        description: error.message
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }
    sendMessage.mutate();
  };

  return (
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
  );
}