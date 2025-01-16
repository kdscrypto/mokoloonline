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
  const captureMetrics = () => {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(() => capturePerformanceMetrics(pageName));
    } else {
      setTimeout(() => capturePerformanceMetrics(pageName), 0);
    }
  };

  useEffect(() => {
    // Capture initial load metrics
    captureMetrics();

    // Listen for route changes
    window.addEventListener('popstate', captureMetrics);
    
    // Listen for initial load
    window.addEventListener('load', captureMetrics);

    return () => {
      window.removeEventListener('popstate', captureMetrics);
      window.removeEventListener('load', captureMetrics);
    };
  }, [pageName]);
};