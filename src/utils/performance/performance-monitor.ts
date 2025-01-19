import { useEffect } from 'react';
import { collectPerformanceMetrics } from './metrics-collector';
import { logPerformanceMetrics } from './metrics-logger';

// Fallback for browsers that don't support requestIdleCallback
const requestIdleCallbackPolyfill = (callback: IdleRequestCallback): number => {
  const start = Date.now();
  return window.setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
    });
  }, 1);
};

const cancelIdleCallbackPolyfill = (id: number) => {
  clearTimeout(id);
};

// Use the native API if available, otherwise use our polyfill
const requestIdle = window.requestIdleCallback || requestIdleCallbackPolyfill;
const cancelIdle = window.cancelIdleCallback || cancelIdleCallbackPolyfill;

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
      const idleCallbackId = requestIdle(() => capturePerformanceMetrics());
      return () => cancelIdle(idleCallbackId);
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