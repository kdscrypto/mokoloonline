import { routes } from "@/config/routes";

export const preloadPopularRoutes = () => {
  // Préchargement prioritaire des routes les plus utilisées
  const priorityRoutes = ['index', 'auth', 'dashboard'];
  
  const preloadRoute = async (path: string) => {
    if (path in routes) {
      const route = routes[path as keyof typeof routes];
      try {
        // Type assertion sécurisée pour accéder au mécanisme de préchargement
        const lazyComponent = route.component as unknown as { 
          _payload?: { _result?: () => Promise<unknown> }
        };
        
        if (lazyComponent._payload?._result) {
          await lazyComponent._payload._result();
          console.log(`✓ Route ${path} préchargée`);
        }
      } catch (error) {
        console.error(`× Échec du préchargement de la route ${path}:`, error);
      }
    }
  };

  // Préchargement séquentiel pour éviter de surcharger le navigateur
  setTimeout(() => {
    priorityRoutes.reduce(
      (promise, path) => promise.then(() => preloadRoute(path)),
      Promise.resolve()
    );
  }, 1000);
};