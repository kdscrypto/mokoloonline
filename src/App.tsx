import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/config/query-client";
import { AppRoutes } from "@/config/routes";
import { RouteWrapper } from "@/components/layout/RouteWrapper";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Toaster />
          <TooltipProvider>
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
              <RouteWrapper>
                <AppRoutes />
              </RouteWrapper>
            </React.Suspense>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;