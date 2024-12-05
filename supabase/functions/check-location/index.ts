import { corsHeaders } from '../_shared/cors.ts'

interface IpapiResponse {
  country_code: string;
  country_name: string;
}

const ALLOWED_COUNTRY = 'CM'; // Code ISO du Cameroun

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Récupérer l'IP du client
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip');
    
    if (!clientIP) {
      throw new Error('Impossible de déterminer votre adresse IP');
    }

    console.log(`Vérification de la localisation pour l'IP: ${clientIP}`);

    // Appel à ipapi.co pour obtenir la localisation
    const response = await fetch(`https://ipapi.co/${clientIP}/json/`);
    const data: IpapiResponse = await response.json();

    console.log('Réponse de ipapi:', data);

    const isAllowed = data.country_code === ALLOWED_COUNTRY;

    if (!isAllowed) {
      // Log de la tentative d'accès non autorisée
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      await supabaseClient
        .from('security_logs')
        .insert({
          event_type: 'BLOCKED_COUNTRY_ACCESS',
          description: `Tentative d'accès depuis ${data.country_name}`,
          ip_address: clientIP,
          metadata: { country_code: data.country_code }
        });
    }

    return new Response(
      JSON.stringify({
        allowed: isAllowed,
        message: isAllowed ? 'Accès autorisé' : 'Ce site est uniquement accessible depuis le Cameroun'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: isAllowed ? 200 : 403
      }
    );

  } catch (error) {
    console.error('Erreur lors de la vérification de la localisation:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Erreur lors de la vérification de la localisation',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})