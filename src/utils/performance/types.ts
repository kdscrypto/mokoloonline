export interface PerformanceMetrics {
  [key: string]: string | number | boolean | null | { [key: string]: any } | any[];
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