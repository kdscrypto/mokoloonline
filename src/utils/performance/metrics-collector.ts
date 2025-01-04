import { PerformanceMetrics, ResourceTiming } from './types';
import { getConnectionInfo } from './network-info';
import { checkServiceWorker } from './service-worker';
import { getCacheHits } from './cache-utils';

export const collectPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  const performance = window.performance;
  
  // Get LCP
  const lcpPromise = new Promise<number>((resolve) => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      resolve(lastEntry ? lastEntry.startTime : 0);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  });

  // Get navigation timing
  const navigationTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  const paintTiming = performance.getEntriesByType("paint");
  
  // Get memory info
  const memory = (performance as any).memory;
  const jsHeapSize = memory ? memory.usedJSHeapSize : undefined;
  
  // Get DOM nodes count
  const domNodes = document.getElementsByTagName('*').length;
  
  // Get connection info
  const { connectionType, effectiveType } = getConnectionInfo();

  // Get Service Worker status
  const serviceWorkerStatus = await checkServiceWorker();
  
  // Get resource timings
  const resourceTimings = performance.getEntriesByType("resource");
  const cacheHits = getCacheHits(resourceTimings as PerformanceResourceTiming[]);
  
  return {
    pageLoadTime: navigationTiming.loadEventEnd - navigationTiming.startTime,
    timeToFirstByte: navigationTiming.responseStart - navigationTiming.requestStart,
    timeToFirstPaint: (paintTiming.find(entry => entry.name === "first-paint")?.startTime || 0),
    timeToFirstContentfulPaint: (paintTiming.find(entry => entry.name === "first-contentful-paint")?.startTime || 0),
    domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.startTime,
    largestContentfulPaint: await lcpPromise,
    resourceLoadTimes: performance.getEntriesByType("resource").map(resource => ({
      name: resource.name,
      duration: resource.duration,
      type: (resource as PerformanceResourceTiming).initiatorType,
      size: (resource as PerformanceResourceTiming).transferSize,
      protocol: (resource as PerformanceResourceTiming).nextHopProtocol,
      priority: (resource as any).priority,
      cacheStatus: (resource as PerformanceResourceTiming).transferSize === 0 ? 'hit' : 'miss'
    })),
    jsHeapSize,
    domNodes,
    connectionType,
    effectiveType,
    serviceWorkerStatus,
    cacheHits
  };
};