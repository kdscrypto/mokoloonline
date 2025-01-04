import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window
const QUEUE_THRESHOLD = 80; // Seuil pour la mise en file d'attente

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { ip } = await req.json();

    // Get current timestamp
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Vérifier si l'IP est bloquée
    const { data: blockedIp } = await supabase
      .from('blocked_ips')
      .select('*')
      .eq('ip_address', ip)
      .single();

    if (blockedIp?.blocked_until && new Date(blockedIp.blocked_until) > new Date()) {
      return new Response(
        JSON.stringify({ 
          error: 'IP blocked',
          blockedUntil: blockedIp.blocked_until
        }),
        { 
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Compter les requêtes récentes
    const { data: requests, error: countError } = await supabase
      .from('security_logs')
      .select('created_at')
      .eq('ip_address', ip)
      .gte('created_at', new Date(windowStart).toISOString());

    if (countError) {
      throw countError;
    }

    const requestCount = requests?.length || 0;

    // Système de file d'attente si proche du seuil
    if (requestCount >= QUEUE_THRESHOLD && requestCount < MAX_REQUESTS) {
      const delay = Math.floor((requestCount - QUEUE_THRESHOLD) * 100); // Délai progressif
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Bloquer si limite dépassée
    if (requestCount >= MAX_REQUESTS) {
      const blockDuration = 5 * 60 * 1000; // 5 minutes
      await supabase.from('blocked_ips').upsert({
        ip_address: ip,
        reason: 'Rate limit exceeded',
        blocked_until: new Date(now + blockDuration).toISOString(),
        request_count: requestCount
      });

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          retryAfter: blockDuration / 1000
        }),
        { 
          status: 429,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': String(blockDuration / 1000)
          }
        }
      );
    }

    // Enregistrer la requête
    await supabase.from('security_logs').insert({
      event_type: 'api_request',
      description: 'API request processed',
      ip_address: ip,
      metadata: { 
        request_count: requestCount,
        window_start: new Date(windowStart).toISOString()
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        remaining: MAX_REQUESTS - requestCount - 1,
        queueDelay: requestCount >= QUEUE_THRESHOLD ? Math.floor((requestCount - QUEUE_THRESHOLD) * 100) : 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in rate-limit function:', error);
    
    // Fallback response en cas d'erreur
    return new Response(
      JSON.stringify({ 
        success: true, // On autorise quand même la requête en cas d'erreur du rate limiting
        fallback: true,
        error: error.message
      }),
      { 
        status: 200, // Fallback : on accepte la requête
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});