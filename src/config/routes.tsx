import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";

const Index = React.lazy(() => import("@/pages/Index"));
const About = React.lazy(() => import("@/pages/About"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const CreateListing = React.lazy(() => import("@/pages/CreateListing"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const EditListing = React.lazy(() => import("@/pages/EditListing"));
const HowItWorks = React.lazy(() => import("@/pages/HowItWorks"));
const ListingDetail = React.lazy(() => import("@/pages/ListingDetail"));
const Moderation = React.lazy(() => import("@/pages/Moderation"));
const Security = React.lazy(() => import("@/pages/Security"));

// Export routes object for preloading
export const routes = {
  index: { path: "/", component: Index },
  about: { path: "/about", component: About },
  auth: { path: "/auth", component: Auth },
  createListing: { path: "/create-listing", component: CreateListing },
  dashboard: { path: "/dashboard", component: Dashboard },
  editListing: { path: "/edit-listing/:id", component: EditListing },
  howItWorks: { path: "/how-it-works", component: HowItWorks },
  listingDetail: { path: "/listings/:id", component: ListingDetail },
  moderation: { path: "/moderation", component: Moderation },
  security: { path: "/security", component: Security },
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/security" element={<Security />} />
      <Route path="/listings/:id" element={<ListingDetail />} />
      
      <Route path="/dashboard" element={
        <AuthGuard requireAuth={true}>
          <Dashboard />
        </AuthGuard>
      } />
      <Route path="/create-listing" element={
        <AuthGuard requireAuth={true}>
          <CreateListing />
        </AuthGuard>
      } />
      <Route path="/edit-listing/:id" element={
        <AuthGuard requireAuth={true}>
          <EditListing />
        </AuthGuard>
      } />
      <Route path="/moderation" element={
        <AuthGuard requireAuth={true} requireAdmin={true}>
          <Moderation />
        </AuthGuard>
      } />
    </Routes>
  );
};