interface CacheOptions {
  ttl?: number;
  key: string;
}

export async function getFromCache<T>(options: CacheOptions): Promise<T | null> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ key: options.key }),
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

export async function setInCache<T>(data: T, options: CacheOptions): Promise<void> {
  try {
    await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cache`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        key: options.key,
        data,
        ttl: options.ttl,
      }),
    });
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