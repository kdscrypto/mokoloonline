export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // En production, remplacez * par votre domaine
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400', // 24 heures
};

// Middleware pour gérer les requêtes CORS preflight
export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  return null;
}