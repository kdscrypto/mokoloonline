import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { RouteWrapper } from "@/components/layout/RouteWrapper";
import { queryClient } from "@/config/query-client";
import { routes } from "@/config/routes";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import Dashboard from "@/pages/Dashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AppContent = React.memo(() => {
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase.auth.token');
        queryClient.clear();
      }
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <RouteWrapper>
      <React.Suspense 
        fallback={
          <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="text-center">
              <LoadingIndicator size="lg" />
              <p className="mt-4 text-sm text-gray-500">Chargement en cours...</p>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/dashboard" element={
            <AuthGuard requireAuth>
              <Dashboard />
            </AuthGuard>
          } />
          {Object.entries(routes).filter(([key]) => key !== 'dashboard').map(([key, route]) => {
            const Component = route.component;
            return (
              <Route
                key={key}
                path={route.path}
                element={
                  <React.Suspense 
                    fallback={
                      <div className="flex items-center justify-center min-h-[200px]">
                        <LoadingIndicator size="sm" />
                      </div>
                    }
                  >
                    <Component />
                  </React.Suspense>
                }
              />
            );
          })}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
      <Toaster />
      <Sonner />
    </RouteWrapper>
  );
});

AppContent.displayName = 'AppContent';

const App = React.memo(() => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </BrowserRouter>
  );
});

App.displayName = 'App';

export default App;