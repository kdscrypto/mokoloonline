import { routes } from "@/config/routes";

export const preloadPopularRoutes = () => {
  const popularPaths = ['index', 'listingDetail', 'auth'];
  
  setTimeout(() => {
    popularPaths.forEach(path => {
      if (path in routes) {
        const route = routes[path as keyof typeof routes];
        route.component().then(() => {
          console.log(`Route ${path} préchargée avec succès`);
        }).catch(error => {
          console.error(`Erreur lors du préchargement de la route ${path}:`, error);
        });
      }
    });
  }, 1000);
};