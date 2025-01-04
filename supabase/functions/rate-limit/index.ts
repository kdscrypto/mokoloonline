import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ip } = await req.json();
    console.log('Checking rate limit for IP:', ip);

    // Vérifier si l'IP est bloquée
    const { data: blockedIp } = await supabase
      .from('blocked_ips')
      .select('*')
      .eq('ip_address', ip)
      .single();

    if (blockedIp) {
      if (blockedIp.blocked_until && new Date(blockedIp.blocked_until) > new Date()) {
        console.log('IP is blocked:', ip);
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded', remaining: 0 }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }

      // Si le blocage est expiré, on le supprime
      await supabase
        .from('blocked_ips')
        .delete()
        .eq('ip_address', ip);
    }

    // Mettre à jour ou créer l'entrée de l'IP
    const { data: ipData, error: upsertError } = await supabase
      .from('blocked_ips')
      .upsert({
        ip_address: ip,
        request_count: blockedIp ? (blockedIp.request_count || 0) + 1 : 1,
        last_request: new Date().toISOString()
      })
      .select()
      .single();

    if (upsertError) throw upsertError;

    // Calculer le délai de file d'attente en fonction du nombre de requêtes
    const queueDelay = Math.max(0, Math.floor((ipData.request_count - 500) * 100));

    // Si trop de requêtes, bloquer l'IP temporairement
    if (ipData.request_count > 1000) {
      await supabase
        .from('blocked_ips')
        .update({
          blocked_until: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
          reason: 'Too many requests'
        })
        .eq('ip_address', ip);

      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', remaining: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      );
    }

    // Réponse normale avec informations sur la limite
    return new Response(
      JSON.stringify({
        success: true,
        remaining: 1000 - ipData.request_count,
        queueDelay
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limit error:', error);
    
    // En cas d'erreur, utiliser le mode fallback
    return new Response(
      JSON.stringify({ success: true, fallback: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});