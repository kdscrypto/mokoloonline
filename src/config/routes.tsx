import { Navigate, Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { MessagingLayout } from "@/components/messaging/MessagingLayout";

const lazyLoad = (importFn: () => Promise<any>) => {
  const Component = lazy(importFn);
  return <Component />;
};

const Index = lazyLoad(() => import("@/pages/Index"));
const About = lazyLoad(() => import("@/pages/About"));
const Auth = lazyLoad(() => import("@/pages/Auth"));
const CreateListing = lazyLoad(() => import("@/pages/CreateListing"));
const EditListing = lazyLoad(() => import("@/pages/EditListing"));
const ListingDetail = lazyLoad(() => import("@/pages/ListingDetail"));
const Dashboard = lazyLoad(() => import("@/pages/Dashboard"));
const HowItWorks = lazyLoad(() => import("@/pages/HowItWorks"));
const Security = lazyLoad(() => import("@/pages/Security"));
const Moderation = lazyLoad(() => import("@/pages/Moderation"));

export const routes = {
  index: {
    path: "/",
    component: Index,
  },
  about: {
    path: "/about",
    component: About,
  },
  auth: {
    path: "/auth",
    component: Auth,
  },
  createListing: {
    path: "/create-listing",
    component: CreateListing,
  },
  editListing: {
    path: "/edit-listing/:id",
    component: EditListing,
  },
  listingDetail: {
    path: "/listing/:id",
    component: ListingDetail,
  },
  dashboard: {
    path: "/dashboard",
    component: Dashboard,
  },
  howItWorks: {
    path: "/how-it-works",
    component: HowItWorks,
  },
  security: {
    path: "/security",
    component: Security,
  },
  moderation: {
    path: "/moderation",
    component: Moderation,
  },
  messages: {
    path: "/messages",
    component: MessagingLayout,
  },
};

export function AppRoutes() {
  return (
    <Routes>
      <Route path={routes.index.path} element={routes.index.component} />
      <Route path={routes.about.path} element={routes.about.component} />
      <Route path={routes.auth.path} element={routes.auth.component} />
      <Route path={routes.createListing.path} element={routes.createListing.component} />
      <Route path={routes.editListing.path} element={routes.editListing.component} />
      <Route path={routes.listingDetail.path} element={routes.listingDetail.component} />
      <Route path={routes.dashboard.path} element={routes.dashboard.component} />
      <Route path={routes.howItWorks.path} element={routes.howItWorks.component} />
      <Route path={routes.security.path} element={routes.security.component} />
      <Route path={routes.moderation.path} element={routes.moderation.component} />
      <Route path={routes.messages.path} element={<MessagingLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}