import { supabase } from "@/integrations/supabase/client";

export async function getFromCache(key: string) {
  try {
    const { data, error } = await supabase.functions.invoke('cache', {
      body: { key, action: 'get' }
    });

    if (error) throw error;
    return data.result ? JSON.parse(data.result) : null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}

export async function setInCache(key: string, value: any) {
  try {
    const { data, error } = await supabase.functions.invoke('cache', {
      body: { key, value, action: 'set' }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
}