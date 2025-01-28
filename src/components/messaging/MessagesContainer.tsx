import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";

interface MessagesContainerProps {
  messages: any[];
  conversation: any;
}

export function MessagesContainer({ messages, conversation }: MessagesContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1" ref={scrollRef}>
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isInitiator={message.sender?.username === conversation.initiator?.username}
          />
        ))}
      </div>
    </ScrollArea>
  );
}