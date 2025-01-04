import React from "react";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { RouteWrapper } from "@/components/layout/RouteWrapper";
import { queryClient } from "@/config/query-client";
import { routes } from "@/config/routes";

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <RouteWrapper>
              <Suspense 
                fallback={
                  <div className="flex items-center justify-center min-h-screen">
                    <LoadingIndicator size="lg" />
                  </div>
                }
              >
                <Routes>
                  {Object.entries(routes).map(([key, route]) => (
                    <Route
                      key={key}
                      path={route.path}
                      element={<route.component />}
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
    </React.StrictMode>
  );
};

export default App;