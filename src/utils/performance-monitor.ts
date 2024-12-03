import { supabase } from "@/integrations/supabase/client";

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  timeToFirstPaint: number;
  timeToFirstContentfulPaint: number;
  domContentLoaded: number;
  resourceLoadTimes: {
    name: string;
    duration: number;
    type: string;
  }[];
}

export const capturePerformanceMetrics = async (pageName: string): Promise<void> => {
  try {
    const performance = window.performance;
    
    // Get navigation timing
    const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const paintTiming = performance.getEntriesByType("paint");
    
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
        type: resource.initiatorType
      }))
    };

    // Log performance data
    await supabase.from('security_logs').insert({
      event_type: 'performance_metrics',
      description: `Performance metrics captured for ${pageName}`,
      metadata: {
        page: pageName,
        metrics,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      }
    });

    // Clear the performance entries to avoid memory leaks
    performance.clearResourceTimings();
    
  } catch (error) {
    console.error('Failed to capture performance metrics:', error);
  }
};

export const usePerformanceMonitoring = (pageName: string) => {
  React.useEffect(() => {
    // Wait for the page to fully load
    window.addEventListener('load', () => {
      // Delay the capture slightly to ensure all metrics are available
      setTimeout(() => capturePerformanceMetrics(pageName), 0);
    });
  }, [pageName]);
};