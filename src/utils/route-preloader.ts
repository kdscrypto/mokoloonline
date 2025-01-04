import { routes } from "@/config/routes";

export const preloadPopularRoutes = () => {
  const popularPaths = ['index', 'listingDetail', 'auth'];
  
  setTimeout(() => {
    popularPaths.forEach(path => {
      if (path in routes) {
        const route = routes[path as keyof typeof routes];
        // Type assertion to access the internal _payload property of lazy components
        const lazyComponent = route.component as unknown as { 
          _payload?: { _result?: () => Promise<unknown> }
        };
        
        try {
          // Access the internal preload mechanism
          if (lazyComponent._payload?._result) {
            lazyComponent._payload._result();
            console.log(`Route ${path} préchargée avec succès`);
          }
        } catch (error) {
          console.error(`Erreur lors du préchargement de la route ${path}:`, error);
        }
      }
    });
  }, 1000);
};