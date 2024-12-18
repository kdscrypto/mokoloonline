import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8"
};

export function LoadingIndicator({ size = "md", className = "" }: LoadingIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin text-primary ${sizeMap[size]} ${className}`} />
    </div>
  );
}