import { useState } from "react";
import { ConversationsList } from "./ConversationsList";
import { ConversationView } from "./ConversationView";
import { AuthGuard } from "@/components/auth/AuthGuard";

export function MessagingLayout() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  return (
    <AuthGuard requireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <ConversationsList
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
            />
          </div>
          <div className="md:col-span-2">
            {selectedConversationId ? (
              <ConversationView conversationId={selectedConversationId} />
            ) : (
              <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">
                  Sélectionnez une conversation pour commencer
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}