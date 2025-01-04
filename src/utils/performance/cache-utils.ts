export const getCacheHits = (resourceTimings: PerformanceResourceTiming[]): number => {
  return resourceTimings.filter(timing => {
    return timing.transferSize === 0 && timing.decodedBodySize > 0;
  }).length;
};