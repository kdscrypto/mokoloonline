import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "@/config/query-client";
import { routes } from "@/config/routes";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Toaster } from "@/components/ui/sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { RouteWrapper } from "@/components/layout/RouteWrapper";

const AppContent: React.FC = () => {
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
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
      <BrowserRouter>
        <RouteWrapper>
          <Routes>
            {Object.entries(routes).map(([key, route]) => {
              const Component = route.component;
              return (
                <Route
                  key={key}
                  path={route.path}
                  element={
                    key === 'dashboard' || key === 'create-listing' ? (
                      <AuthGuard requireAuth>
                        <Component />
                      </AuthGuard>
                    ) : key === 'moderation' ? (
                      <AuthGuard requireAuth requireAdmin>
                        <Component />
                      </AuthGuard>
                    ) : (
                      <Component />
                    )
                  }
                />
              );
            })}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RouteWrapper>
        <Toaster />
      </BrowserRouter>
    </React.Suspense>
  );
}

const App: React.FC = () => {
  return (
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  );
}

export default App;