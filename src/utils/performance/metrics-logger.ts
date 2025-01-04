import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types/database";
import { PerformanceMetrics, ResourceTiming } from './types';

const serializeResourceTiming = (timing: ResourceTiming): { [key: string]: Json } => ({
  name: timing.name,
  duration: timing.duration,
  type: timing.type,
  size: timing.size,
  protocol: timing.protocol,
  priority: timing.priority,
  cacheStatus: timing.cacheStatus
});

const serializeMetrics = (metrics: PerformanceMetrics): { [key: string]: Json } => ({
  pageLoadTime: metrics.pageLoadTime,
  timeToFirstByte: metrics.timeToFirstByte,
  timeToFirstPaint: metrics.timeToFirstPaint,
  timeToFirstContentfulPaint: metrics.timeToFirstContentfulPaint,
  domContentLoaded: metrics.domContentLoaded,
  largestContentfulPaint: metrics.largestContentfulPaint,
  firstInputDelay: metrics.firstInputDelay,
  cumulativeLayoutShift: metrics.cumulativeLayoutShift,
  resourceLoadTimes: metrics.resourceLoadTimes.map(serializeResourceTiming),
  jsHeapSize: metrics.jsHeapSize,
  domNodes: metrics.domNodes,
  connectionType: metrics.connectionType,
  effectiveType: metrics.effectiveType,
  serviceWorkerStatus: metrics.serviceWorkerStatus,
  cacheHits: metrics.cacheHits
});

export const logPerformanceMetrics = async (pageName: string, metrics: PerformanceMetrics): Promise<void> => {
  try {
    await supabase.from('security_logs').insert({
      event_type: 'performance_metrics',
      description: `Performance metrics captured for ${pageName}`,
      metadata: {
        page: pageName,
        metrics: serializeMetrics(metrics),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    });

    // Log slow resources
    metrics.resourceLoadTimes
      .filter(resource => resource.duration > 1000)
      .forEach(resource => {
        console.warn('Ressource lente détectée:', {
          name: resource.name,
          duration: `${(resource.duration / 1000).toFixed(2)}s`,
          type: resource.type,
          size: resource.size ? `${(resource.size / 1024).toFixed(2)}KB` : 'N/A',
          cacheStatus: resource.cacheStatus
        });
      });

  } catch (error) {
    console.error('Failed to log performance metrics:', error);
  }
};