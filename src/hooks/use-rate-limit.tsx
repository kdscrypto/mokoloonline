import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRateLimit() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [queueDelay, setQueueDelay] = useState(0);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        // First, get the client's IP address from the request headers
        const { data: ipData } = await supabase.functions.invoke('get-client-ip');
        const clientIp = ipData?.ip || 'unknown';

        // Then query the blocked_ips table for this specific IP
        const { data, error } = await supabase
          .from('blocked_ips')
          .select('request_count, blocked_until')
          .eq('ip_address', clientIp)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la vérification du rate limit:", error);
          return;
        }

        if (data) {
          const isBlocked = data.blocked_until && new Date(data.blocked_until) > new Date();
          setIsRateLimited(isBlocked);
          
          // Calculer le délai en fonction du nombre de requêtes
          const baseDelay = Math.max(0, data.request_count - 500) * 10; // 10ms par requête au-delà de 500
          setQueueDelay(baseDelay);
          
          // Mode dégradé si plus de 1000 requêtes
          setIsFallback(data.request_count > 1000);
        } else {
          // Aucune entrée trouvée pour cette IP, réinitialiser les états
          setIsRateLimited(false);
          setQueueDelay(0);
          setIsFallback(false);

          // Create an initial entry for this IP
          const { error: insertError } = await supabase
            .from('blocked_ips')
            .insert([
              { 
                ip_address: clientIp,
                request_count: 1,
                last_request: new Date().toISOString()
              }
            ]);

          if (insertError) {
            console.error("Erreur lors de l'initialisation du rate limit:", insertError);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rate limit:", error);
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return { isRateLimited, queueDelay, isFallback };
}