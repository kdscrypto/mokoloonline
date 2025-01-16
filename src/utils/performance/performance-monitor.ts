import { useEffect } from 'react';
import { collectPerformanceMetrics } from './metrics-collector';
import { logPerformanceMetrics } from './metrics-logger';

export const usePerformanceMonitoring = (pageName: string) => {
  useEffect(() => {
    const capturePerformanceMetrics = async () => {
      try {
        const metrics = await collectPerformanceMetrics();
        await logPerformanceMetrics(pageName, metrics);
        performance.clearResourceTimings();
      } catch (error) {
        console.error('Failed to capture performance metrics:', error);
      }
    };

    // Initial capture
    capturePerformanceMetrics();

    // Setup event listeners
    const handleRouteChange = () => {
      requestIdleCallback(() => capturePerformanceMetrics());
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('load', handleRouteChange);

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('load', handleRouteChange);
    };
  }, [pageName]); // Only re-run if pageName changes
};