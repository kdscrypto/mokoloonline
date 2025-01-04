import { routes } from "@/config/routes";

export const preloadPopularRoutes = () => {
  const popularPaths = ['index', 'listingDetail', 'auth'];
  
  setTimeout(() => {
    popularPaths.forEach(path => {
      if (path in routes) {
        const route = routes[path as keyof typeof routes];
        // Préchargement du composant lazy
        route.component.preload?.();
        console.log(`Route ${path} préchargée avec succès`);
      }
    });
  }, 1000);
};