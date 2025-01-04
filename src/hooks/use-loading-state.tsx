import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('Erreur de chargement:', error);
    setError(error);
    setIsLoading(false);
    toast.error("Une erreur est survenue", {
      description: error.message
    });
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    handleError
  };
};