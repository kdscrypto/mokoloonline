import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { RouteWrapper } from "@/components/layout/RouteWrapper";
import { queryClient } from "@/config/query-client";
import { routes } from "@/config/routes";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <RouteWrapper>
              <Suspense 
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
                  {Object.entries(routes).map(([key, route]) => (
                    <Route
                      key={key}
                      path={route.path}
                      element={
                        <Suspense 
                          fallback={
                            <div className="flex items-center justify-center min-h-[200px]">
                              <LoadingIndicator size="sm" />
                            </div>
                          }
                        >
                          {route.element ? route.element(route.component) : <route.component />}
                        </Suspense>
                      }
                    />
                  ))}
                </Routes>
              </Suspense>
            </RouteWrapper>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;