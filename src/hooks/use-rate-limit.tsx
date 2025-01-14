import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRateLimit() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [queueDelay, setQueueDelay] = useState(0);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    const checkRateLimit = async () => {
      try {
        console.log("Checking rate limit...");
        
        const { data, error } = await supabase
          .from('blocked_ips')
          .select('*')
          .order('last_request', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la vérification du rate limit:", error);
          // En cas d'erreur, on passe en mode dégradé plutôt que de bloquer l'utilisateur
          setIsFallback(true);
          setIsRateLimited(false);
          setQueueDelay(0);
          return;
        }

        console.log("Rate limit data:", data);

        if (data) {
          const isBlocked = data.blocked_until && new Date(data.blocked_until) > new Date();
          setIsRateLimited(isBlocked);
          
          if (isBlocked) {
            console.log("User is rate limited until:", data.blocked_until);
            toast.error("Trop de requêtes, veuillez patienter");
          }
          
          // Calculer le délai en fonction du nombre de requêtes
          const baseDelay = Math.max(0, (data.request_count || 0) - 500) * 10;
          setQueueDelay(baseDelay);
          
          // Mode dégradé si plus de 1000 requêtes
          setIsFallback(data.request_count > 1000);

          try {
            // Update the request count
            const { error: updateError } = await supabase
              .from('blocked_ips')
              .update({ 
                request_count: (data.request_count || 0) + 1,
                last_request: new Date().toISOString()
              })
              .eq('id', data.id);

            if (updateError) {
              console.error("Erreur lors de la mise à jour du rate limit:", updateError);
            }
          } catch (updateError) {
            console.error("Erreur lors de la mise à jour du compteur:", updateError);
          }
        } else {
          // Réinitialiser les états si aucune donnée
          setIsRateLimited(false);
          setQueueDelay(0);
          setIsFallback(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du rate limit:", error);
        // En cas d'erreur, on passe en mode dégradé
        setIsFallback(true);
        setIsRateLimited(false);
        setQueueDelay(0);
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 5000); // Vérifier toutes les 5 secondes

    return () => clearInterval(interval);
  }, []);

  return { isRateLimited, queueDelay, isFallback };
}