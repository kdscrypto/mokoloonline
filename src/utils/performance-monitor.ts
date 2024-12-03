import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types/database";

interface ResourceTiming {
  name: string;
  duration: number;
  type: string;
}

interface PerformanceMetricsData {
  pageLoadTime: number;
  timeToFirstByte: number;
  timeToFirstPaint: number;
  timeToFirstContentfulPaint: number;
  domContentLoaded: number;
  resourceLoadTimes: ResourceTiming[];
}

const serializeResourceTiming = (timing: ResourceTiming): { [key: string]: Json } => ({
  name: timing.name,
  duration: timing.duration,
  type: timing.type
});

const serializeMetrics = (metrics: PerformanceMetricsData): { [key: string]: Json } => ({
  pageLoadTime: metrics.pageLoadTime,
  timeToFirstByte: metrics.timeToFirstByte,
  timeToFirstPaint: metrics.timeToFirstPaint,
  timeToFirstContentfulPaint: metrics.timeToFirstContentfulPaint,
  domContentLoaded: metrics.domContentLoaded,
  resourceLoadTimes: metrics.resourceLoadTimes.map(serializeResourceTiming)
});

export const capturePerformanceMetrics = async (pageName: string): Promise<void> => {
  try {
    const performance = window.performance;
    
    // Get navigation timing
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const paintTiming = performance.getEntriesByType("paint");
    
    // Calculate key metrics
    const metrics: PerformanceMetricsData = {
      pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.startTime,
      timeToFirstByte: navigationTiming.responseStart - navigationTiming.requestStart,
      timeToFirstPaint: (paintTiming.find(entry => entry.name === "first-paint")?.startTime || 0),
      timeToFirstContentfulPaint: (paintTiming.find(entry => entry.name === "first-contentful-paint")?.startTime || 0),
      domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime,
      resourceLoadTimes: performance.getEntriesByType("resource").map(resource => ({
        name: resource.name,
        duration: resource.duration,
        type: (resource as PerformanceResourceTiming).initiatorType
      }))
    };

    // Log performance data
    await supabase.from('security_logs').insert({
      event_type: 'performance_metrics',
      description: `Performance metrics captured for ${pageName}`,
      metadata: {
        page: pageName,
        metrics: serializeMetrics(metrics),
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      } as Json
    });

    // Clear the performance entries to avoid memory leaks
    performance.clearResourceTimings();
    
  } catch (error) {
    console.error('Failed to capture performance metrics:', error);
  }
};

export const usePerformanceMonitoring = (pageName: string) => {
  useEffect(() => {
    // Wait for the page to fully load
    window.addEventListener('load', () => {
      // Delay the capture slightly to ensure all metrics are available
      setTimeout(() => capturePerformanceMetrics(pageName), 0);
    });
  }, [pageName]);
};