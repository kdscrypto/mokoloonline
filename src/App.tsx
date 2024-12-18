import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { usePerformanceMonitoring } from "@/utils/performance-monitor";
import { Suspense, lazy } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

// Lazy load components
const Index = lazy(() => import("./pages/Index"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Security = lazy(() => import("./pages/Security"));

// Configure React Query with performance optimizations
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (remplacé cacheTime par gcTime)
      retry: 1,
      suspense: true,
      refetchOnWindowFocus: false, // Désactive le refetch automatique
      refetchOnMount: false, // Désactive le refetch au montage
    },
  },
});

// Route wrapper component for performance monitoring
const RouteWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  usePerformanceMonitoring(location.pathname);
  return <>{children}</>;
};

// Préchargement des routes populaires
const preloadPopularRoutes = () => {
  const popularRoutes = [
    () => import("./pages/Index"),
    () => import("./pages/ListingDetail"),
    () => import("./pages/Auth"),
  ];

  // Précharge en arrière-plan après le chargement initial
  setTimeout(() => {
    popularRoutes.forEach((route) => {
      route().then(() => {
        console.log("Route préchargée avec succès");
      });
    });
  }, 1000);
};

const App = () => {
  // Déclenche le préchargement des routes populaires
  preloadPopularRoutes();

  return (
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
                <Route path="/" element={<Index />} />
                <Route path="/listing/:id" element={<ListingDetail />} />
                <Route path="/create" element={<CreateListing />} />
                <Route path="/edit-listing/:id" element={<EditListing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route 
                  path="/admin" 
                  element={
                    <AuthGuard requireAuth requireAdmin>
                      <Admin />
                    </AuthGuard>
                  } 
                />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/security" element={<Security />} />
              </Routes>
            </Suspense>
          </RouteWrapper>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;