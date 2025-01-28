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

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/security" element={<Security />} />
      <Route path="/listings/:id" element={<ListingDetail />} />
      
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/moderation" element={<Moderation />} />
      </Route>
    </Routes>
  );
};