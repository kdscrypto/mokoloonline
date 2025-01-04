export const checkServiceWorker = async (): Promise<string> => {
  if (!('serviceWorker' in navigator)) {
    return 'not_supported';
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.active ? 'active' : 'inactive';
  } catch {
    return 'error';
  }
};