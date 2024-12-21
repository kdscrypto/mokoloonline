import { routes } from "@/config/routes";

export const preloadPopularRoutes = () => {
  const popularRoutes = [
    routes.index.component,
    routes.listingDetail.component,
    routes.auth.component,
  ];

  setTimeout(() => {
    popularRoutes.forEach((route) => {
      route().then(() => {
        console.log("Route préchargée avec succès");
      });
    });
  }, 1000);
};