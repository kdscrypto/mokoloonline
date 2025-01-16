import { supabase } from "@/integrations/supabase/client";
import type { PerformanceMetrics } from './types';

interface ViewportDimensions {
  width: number;
  height: number;
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

    const metadata = {
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