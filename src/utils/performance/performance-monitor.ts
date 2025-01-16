import { useEffect } from 'react';
import { collectPerformanceMetrics } from './metrics-collector';
import { logPerformanceMetrics } from './metrics-logger';

const capturePerformanceMetrics = async (pageName: string): Promise<void> => {
  try {
    const metrics = await collectPerformanceMetrics();
    await logPerformanceMetrics(pageName, metrics);
    performance.clearResourceTimings();
  } catch (error) {
    console.error('Failed to capture performance metrics:', error);
  }
};

export const usePerformanceMonitoring = (pageName: string) => {
  useEffect(() => {
    const captureMetrics = () => {
      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => capturePerformanceMetrics(pageName));
      } else {
        setTimeout(() => capturePerformanceMetrics(pageName), 0);
      }
    };

    // Capture initial load metrics
    captureMetrics();

    // Listen for route changes and initial load
    window.addEventListener('popstate', captureMetrics);
    window.addEventListener('load', captureMetrics);

    return () => {
      window.removeEventListener('popstate', captureMetrics);
      window.removeEventListener('load', captureMetrics);
    };
  }, [pageName]);
};