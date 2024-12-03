import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // Maximum requests per window

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

    // Log security event for rate limiting check
    const { data: requests, error: countError } = await supabase
      .from('security_logs')
      .select('created_at')
      .eq('ip_address', ip)
      .gte('created_at', new Date(windowStart).toISOString());

    if (countError) {
      throw countError;
    }

    const requestCount = requests?.length || 0;

    if (requestCount >= MAX_REQUESTS) {
      // Log rate limit exceeded
      await supabase.from('security_logs').insert({
        event_type: 'suspicious_activity',
        description: 'Rate limit exceeded',
        ip_address: ip,
        metadata: { request_count: requestCount }
      });

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded',
          resetAt: new Date(now + RATE_LIMIT_WINDOW).toISOString()
        }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Log successful request
    await supabase.from('security_logs').insert({
      event_type: 'api',
      description: 'API request',
      ip_address: ip
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        remaining: MAX_REQUESTS - requestCount - 1
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in rate-limit function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});