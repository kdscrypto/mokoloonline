import { routes } from "@/config/routes";

export const preloadPopularRoutes = () => {
  const popularRoutes = [
    routes.index.component,
    routes.listingDetail.component,
    routes.auth.component,
  ];

  setTimeout(() => {
    popularRoutes.forEach((Route) => {
      Route().then(() => {
        console.log("Route préchargée avec succès");
      }).catch((error) => {
        console.error("Erreur lors du préchargement de la route:", error);
      });
    });
  }, 1000);
};