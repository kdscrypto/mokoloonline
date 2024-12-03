import { useEffect, useRef } from 'react';
import { debounce } from 'lodash';

export function useResizeObserver(callback: ResizeObserverCallback) {
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const debouncedCallback = debounce(callback, 100);
    
    observerRef.current = new ResizeObserver((...args) => {
      window.requestAnimationFrame(() => {
        debouncedCallback(...args);
      });
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback]);

  return observerRef;
}