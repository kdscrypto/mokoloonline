import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types/database";

type JsonValue = string | number | boolean | null | { [key: string]: JsonValue } | JsonValue[];
type Json = JsonValue;

interface PerformanceMetrics {
  [key: string]: Json;
}

interface ViewportDimensions {
  [key: string]: number;
}

export async function logPerformanceMetrics(
  page: string,
  metrics: PerformanceMetrics
) {
  try {
    const viewport: ViewportDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    const metadata: { [key: string]: Json } = {
      page,
      metrics,
      userAgent: navigator.userAgent,
      viewport,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    await supabase.from('security_logs').insert({
      event_type: 'performance_metrics',
      description: `Performance metrics collected for ${page}`,
      metadata
    });

  } catch (error) {
    console.error('Failed to log performance metrics:', error);
  }
}

export async function getPerformanceLogs(
  userId: string,
  eventType: string,
  description: string
) {
  return await supabase
    .from('security_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('event_type', eventType)
    .eq('description', description)
    .order('created_at', { ascending: false });
}