export interface ResourceTiming {
  name: string;
  duration: number;
  type: string;
  size?: number;
  protocol?: string;
  priority?: string;
  cacheStatus?: string;
}

export interface PerformanceMetrics {
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
  serviceWorkerStatus: string;
  cacheHits?: number;
}