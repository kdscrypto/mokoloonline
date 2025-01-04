import { useEffect } from 'react';
import { collectPerformanceMetrics } from './metrics-collector';
import { logPerformanceMetrics } from './metrics-logger';

export const capturePerformanceMetrics = async (pageName: string): Promise<void> => {
  try {
    const metrics = await collectPerformanceMetrics();
    await logPerformanceMetrics(pageName, metrics);
    
    // Clear performance entries after processing
    performance.clearResourceTimings();
    
  } catch (error) {
    console.error('Failed to capture performance metrics:', error);
  }
};

export const usePerformanceMonitoring = (pageName: string) => {
  useEffect(() => {
    // Capture initial load metrics
    const captureMetrics = () => {
      requestIdleCallback(() => capturePerformanceMetrics(pageName));
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