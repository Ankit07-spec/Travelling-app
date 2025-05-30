import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Calls window.frameworkReady() once on mount, if it exists and window is defined
export function useFrameworkReady() {
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.frameworkReady === "function") {
      window.frameworkReady();
    }
  }, []);
}
