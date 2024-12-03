import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { connect } from "https://deno.land/x/redis@v0.29.0/mod.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const redis = await connect({
      hostname: Deno.env.get('REDIS_HOST') || 'localhost',
      port: parseInt(Deno.env.get('REDIS_PORT') || '6379'),
      password: Deno.env.get('REDIS_PASSWORD'),
    })

    const { key, value, action } = await req.json()

    if (!key) {
      throw new Error('Cache key is required')
    }

    let result
    console.log(`Cache ${action} request for key: ${key}`)

    if (action === 'get') {
      result = await redis.get(key)
      console.log(`Cache get result: ${result}`)
    } else if (action === 'set' && value) {
      await redis.set(key, JSON.stringify(value), { ex: 3600 }) // 1 hour expiration
      result = 'OK'
      console.log(`Cache set completed for key: ${key}`)
    } else {
      throw new Error('Invalid cache action')
    }

    await redis.close()
    
    return new Response(
      JSON.stringify({ result }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Cache operation failed:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})