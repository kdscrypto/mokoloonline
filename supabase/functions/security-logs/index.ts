import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

interface LogEvent {
  event_type: 'auth' | 'api' | 'suspicious_activity';
  description: string;
  user_id?: string;
  ip_address?: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event }: { event: LogEvent } = await req.json();
    
    // Validation basique
    if (!event.event_type || !event.description) {
      throw new Error('Missing required fields');
    }

    // Ajouter l'horodatage
    const timestamp = new Date().toISOString();

    // Enregistrer l'événement dans la base de données
    const { data, error } = await supabase
      .from('security_logs')
      .insert([
        {
          event_type: event.event_type,
          description: event.description,
          user_id: event.user_id,
          ip_address: event.ip_address,
          metadata: event.metadata,
          created_at: timestamp
        }
      ]);

    if (error) throw error;

    // Vérifier les activités suspectes
    if (event.event_type === 'suspicious_activity') {
      // Envoyer une notification aux administrateurs (à implémenter selon vos besoins)
      console.warn(`Suspicious activity detected: ${event.description}`);
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});