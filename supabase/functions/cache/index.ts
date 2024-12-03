import { createClient } from '@supabase/supabase-js';
import { Redis } from 'ioredis';
import { corsHeaders } from '../_shared/cors';

const redis = new Redis(Deno.env.get('REDIS_URL') || '');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_CACHE_TTL = 60 * 5; // 5 minutes

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { key, data, ttl = DEFAULT_CACHE_TTL } = await req.json();

    if (!key) {
      throw new Error('Cache key is required');
    }

    // If data is provided, set it in cache
    if (data) {
      await redis.setex(key, ttl, JSON.stringify(data));
      return new Response(
        JSON.stringify({ message: 'Data cached successfully' }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // If no data provided, try to get from cache
    const cachedData = await redis.get(key);
    
    if (cachedData) {
      return new Response(
        JSON.stringify({ data: JSON.parse(cachedData), fromCache: true }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Cache miss', data: null }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});