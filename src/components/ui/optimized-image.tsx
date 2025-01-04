import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  loadingClassName?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className,
  loadingClassName,
  width,
  height,
  ...props 
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Fonction pour construire l'URL optimisée avec Supabase Storage CDN
  const getOptimizedImageUrl = (url: string) => {
    if (!url || !url.includes('storage.googleapis.com')) return url;
    
    // Construire l'URL avec les paramètres de transformation
    const baseUrl = url.split('?')[0];
    const transformParams = new URLSearchParams({
      width: width?.toString() || '800',
      height: height?.toString() || '600',
      quality: '80',
      format: 'webp',
    });

    return `${baseUrl}?${transformParams.toString()}`;
  };

  useEffect(() => {
    const img = new Image();
    img.src = getOptimizedImageUrl(src);
    
    img.onload = () => {
      setIsLoading(false);
      setImageSrc(img.src);
    };
    
    img.onerror = () => {
      setError(true);
      setIsLoading(false);
      setImageSrc("/placeholder.svg");
      console.error(`Erreur de chargement de l'image: ${src}`);
    };
  }, [src, width, height]);

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
        loading="lazy"
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