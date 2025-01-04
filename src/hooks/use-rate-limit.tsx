import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRateLimit() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['rate-limit'],
    queryFn: async () => {
      try {
        const response = await supabase.functions.invoke('rate-limit', {
          body: { ip: await fetch('https://api.ipify.org?format=json').then(r => r.json()).then(data => data.ip) }
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.data;
      } catch (error) {
        console.error('Rate limit check failed:', error);
        // En cas d'erreur, on utilise le fallback
        return { success: true, fallback: true };
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    isRateLimited: data?.error === 'Rate limit exceeded',
    queueDelay: data?.queueDelay || 0,
    remaining: data?.remaining,
    isLoading,
    error,
    isFallback: data?.fallback
  };
}