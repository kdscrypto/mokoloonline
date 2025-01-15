import { lazy } from "react";

const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CreateListing = lazy(() => import("@/pages/CreateListing"));
const EditListing = lazy(() => import("@/pages/EditListing"));
const ListingDetail = lazy(() => import("@/pages/ListingDetail"));
const About = lazy(() => import("@/pages/About"));
const HowItWorks = lazy(() => import("@/pages/HowItWorks"));
const Security = lazy(() => import("@/pages/Security"));
const Moderation = lazy(() => import("@/pages/Moderation"));

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