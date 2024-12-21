import { useLocation } from "react-router-dom";
import { usePerformanceMonitoring } from "@/utils/performance-monitor";

export const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  usePerformanceMonitoring(location.pathname);
  return <>{children}</>;
};