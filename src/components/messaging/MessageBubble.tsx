interface MessageBubbleProps {
  message: any;
  isInitiator: boolean;
}

export function MessageBubble({ message, isInitiator }: MessageBubbleProps) {
  return (
    <div
      className={`flex flex-col ${
        isInitiator ? "items-start" : "items-end"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isInitiator
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
  );
}