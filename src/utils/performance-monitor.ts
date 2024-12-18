import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types/database";

interface ResourceTiming {
  name: string;
  duration: number;
  type: string;
  size?: number;
  protocol?: string;
}

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  timeToFirstPaint: number;
  timeToFirstContentfulPaint: number;
  domContentLoaded: number;
  largestContentfulPaint?: number;
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  resourceLoadTimes: ResourceTiming[];
  jsHeapSize?: number;
  domNodes: number;
  connectionType?: string;
  effectiveType?: string;
}

const serializeResourceTiming = (timing: ResourceTiming): { [key: string]: Json } => ({
  name: timing.name,
  duration: timing.duration,
  type: timing.type,
  size: timing.size,
  protocol: timing.protocol
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
  effectiveType: metrics.effectiveType
});

const getConnectionInfo = () => {
  const connection = (navigator as any).connection;
  if (!connection) return {};
  
  return {
    connectionType: connection.type,
    effectiveType: connection.effectiveType
  };
};

export const capturePerformanceMetrics = async (pageName: string): Promise<void> => {
  try {
    const performance = window.performance;
    
    // Get navigation timing
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const paintTiming = performance.getEntriesByType("paint");
    
    // Get memory info if available
    const memory = (performance as any).memory;
    const jsHeapSize = memory ? memory.usedJSHeapSize : undefined;
    
    // Get DOM nodes count
    const domNodes = document.getElementsByTagName('*').length;
    
    // Get connection info
    const { connectionType, effectiveType } = getConnectionInfo();
    
    // Calculate key metrics
    const metrics: PerformanceMetrics = {
      pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.startTime,
      timeToFirstByte: navigationTiming.responseStart - navigationTiming.requestStart,
      timeToFirstPaint: (paintTiming.find(entry => entry.name === "first-paint")?.startTime || 0),
      timeToFirstContentfulPaint: (paintTiming.find(entry => entry.name === "first-contentful-paint")?.startTime || 0),
      domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime,
      resourceLoadTimes: performance.getEntriesByType("resource").map(resource => ({
        name: resource.name,
        duration: resource.duration,
        type: (resource as PerformanceResourceTiming).initiatorType,
        size: (resource as PerformanceResourceTiming).transferSize,
        protocol: (resource as PerformanceResourceTiming).nextHopProtocol
      })),
      jsHeapSize,
      domNodes,
      connectionType,
      effectiveType
    };

    // Log performance data with detailed metadata
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

    // Log slow resources for debugging
    metrics.resourceLoadTimes
      .filter(resource => resource.duration > 1000)
      .forEach(resource => {
        console.warn('Ressource lente détectée:', {
          name: resource.name,
          duration: `${(resource.duration / 1000).toFixed(2)}s`,
          type: resource.type,
          size: resource.size ? `${(resource.size / 1024).toFixed(2)}KB` : 'N/A'
        });
      });

    // Clear the performance entries to avoid memory leaks
    performance.clearResourceTimings();
    
  } catch (error) {
    console.error('Failed to capture performance metrics:', error);
  }
};

export const usePerformanceMonitoring = (pageName: string) => {
  useEffect(() => {
    // Capture initial load metrics
    const captureMetrics = () => {
      // Delay the capture slightly to ensure all metrics are available
      setTimeout(() => capturePerformanceMetrics(pageName), 0);
    };

    // Listen for route changes
    window.addEventListener('popstate', captureMetrics);
    
    // Capture metrics on initial load
    window.addEventListener('load', captureMetrics);

    return () => {
      window.removeEventListener('popstate', captureMetrics);
      window.removeEventListener('load', captureMetrics);
    };
  }, [pageName]);
};