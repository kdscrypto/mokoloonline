import React from 'react';
import { useLocation } from 'react-router-dom';
import { usePerformanceMonitoring } from '@/utils/performance/performance-monitor';

interface RouteWrapperProps {
  children: React.ReactNode;
}

export function RouteWrapper({ children }: RouteWrapperProps) {
  const location = useLocation();
  
  React.useEffect(() => {
    usePerformanceMonitoring(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}