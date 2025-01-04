import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRateLimit() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [queueDelay, setQueueDelay] = useState(0);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        const { data, error } = await supabase
          .from('blocked_ips')
          .select('request_count, blocked_until')
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
          // Aucune entrée trouvée, réinitialiser les états
          setIsRateLimited(false);
          setQueueDelay(0);
          setIsFallback(false);
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