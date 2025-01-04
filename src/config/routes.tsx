import { lazy } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";

export interface CustomRouteObject {
  path: string;
  component: React.LazyExoticComponent<() => JSX.Element>;
  element?: (Component: React.ComponentType) => JSX.Element;
}

export const routes: Record<string, CustomRouteObject> = {
  index: {
    path: "/",
    component: lazy(() => import("@/pages/Index")),
  },
  listingDetail: {
    path: "/listing/:id",
    component: lazy(() => import("@/pages/ListingDetail")),
  },
  createListing: {
    path: "/create",
    component: lazy(() => import("@/pages/CreateListing")),
  },
  editListing: {
    path: "/edit-listing/:id",
    component: lazy(() => import("@/pages/EditListing")),
  },
  auth: {
    path: "/auth",
    component: lazy(() => import("@/pages/Auth")),
  },
  dashboard: {
    path: "/dashboard",
    component: lazy(() => import("@/pages/Dashboard")),
  },
  admin: {
    path: "/admin",
    component: lazy(() => import("@/pages/Admin")),
    element: (Component: React.ComponentType) => (
      <AuthGuard requireAuth requireAdmin>
        <Component />
      </AuthGuard>
    ),
  },
  about: {
    path: "/about",
    component: lazy(() => import("@/pages/About")),
  },
  howItWorks: {
    path: "/how-it-works",
    component: lazy(() => import("@/pages/HowItWorks")),
  },
  security: {
    path: "/security",
    component: lazy(() => import("@/pages/Security")),
  },
};