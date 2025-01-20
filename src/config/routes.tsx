import { lazy, Suspense } from "react";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

const lazyLoad = (importFn: () => Promise<any>) => {
  const LazyComponent = lazy(importFn);
  return () => (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingIndicator size="sm" />
      </div>
    }>
      <LazyComponent />
    </Suspense>
  );
};

const Index = lazyLoad(() => import("@/pages/Index"));
const Auth = lazyLoad(() => import("@/pages/Auth"));
const Dashboard = lazyLoad(() => import("@/pages/Dashboard"));
const CreateListing = lazyLoad(() => import("@/pages/CreateListing"));
const EditListing = lazyLoad(() => import("@/pages/EditListing"));
const ListingDetail = lazyLoad(() => import("@/pages/ListingDetail"));
const About = lazyLoad(() => import("@/pages/About"));
const HowItWorks = lazyLoad(() => import("@/pages/HowItWorks"));
const Security = lazyLoad(() => import("@/pages/Security"));
const Moderation = lazyLoad(() => import("@/pages/Moderation"));

export const routes = {
  index: {
    path: "/",
    component: Index,
  },
  auth: {
    path: "/auth",
    component: Auth,
  },
  dashboard: {
    path: "/dashboard",
    component: Dashboard,
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
  about: {
    path: "/about",
    component: About,
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
} as const;