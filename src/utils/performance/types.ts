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
  [key: string]: any; // Add index signature to allow dynamic properties
  pageLoadTime: number;
  timeToFirstByte: number;
  timeToFirstPaint: number;
  timeToFirstContentfulPaint: number;
  domContentLoaded: number;
  largestContentfulPaint?: number;
  resourceLoadTimes: ResourceTiming[];
  jsHeapSize?: number;
  domNodes: number;
  connectionType?: string;
  effectiveType?: string;
  serviceWorkerStatus: string;
  cacheHits?: number;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

export interface PerformanceLogData {
  page: string;
  metrics: PerformanceMetrics;
  userAgent: string;
  viewport: ViewportDimensions;
  timestamp: string;
  url: string;
}