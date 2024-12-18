import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  loadingClassName,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setIsLoading(false);
      setImageSrc(src);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
      setImageSrc("/placeholder.svg");
      console.error(`Erreur de chargement de l'image: ${src}`);
    };
  }, [src]);

  return (
    <div className={cn(
      "relative overflow-hidden",
      isLoading && "animate-pulse bg-gray-200",
      className
    )}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          loadingClassName
        )}>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageSrc}
        alt={error ? "Image non disponible" : alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          error && "grayscale",
          className
        )}
        {...props}
      />
    </div>
  );
}