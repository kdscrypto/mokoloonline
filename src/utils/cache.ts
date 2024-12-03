interface CacheOptions {
  ttl?: number;
  key: string;
}

import { supabase } from '@/integrations/supabase/client';

export async function getFromCache<T>(options: CacheOptions): Promise<T | null> {
  try {
    const { data, error } = await supabase.functions.invoke('cache', {
      body: { key: options.key }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

export async function setInCache<T>(data: T, options: CacheOptions): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('cache', {
      body: {
        key: options.key,
        data,
        ttl: options.ttl,
      }
    });

    if (error) throw error;
  } catch (error) {
    console.error('Cache error:', error);
  }
}

// Utility function to generate cache keys
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);

  return `${prefix}:${JSON.stringify(sortedParams)}`;
}