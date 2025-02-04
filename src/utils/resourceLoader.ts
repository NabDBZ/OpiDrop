// Resource loading optimization
const resourceCache = new Map<string, Promise<any>>();

export const resourceLoader = {
  // Preload critical resources
  preloadCriticalResources() {
    const criticalResources = [
      '/assets/fonts/main.woff2',
      '/assets/icons/sprite.svg'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.woff2') ? 'font' : 'image';
      document.head.appendChild(link);
    });
  },

  // Load resources with caching and retry
  async loadResource<T>(
    key: string,
    loader: () => Promise<T>,
    options: {
      retries?: number;
      timeout?: number;
      cacheDuration?: number;
    } = {}
  ): Promise<T> {
    const { retries = 3, timeout = 5000, cacheDuration = 60000 } = options;

    // Check cache first
    const cached = resourceCache.get(key);
    if (cached) return cached;

    // Create loading promise with timeout and retries
    const loadWithRetry = async (attempt: number = 0): Promise<T> => {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Loading timeout')), timeout);
        });

        const result = await Promise.race([loader(), timeoutPromise]);
        resourceCache.set(key, result);
        
        // Clear cache after duration
        setTimeout(() => resourceCache.delete(key), cacheDuration);
        
        return result;
      } catch (error) {
        if (attempt < retries) {
          // Exponential backoff
          await new Promise(resolve => 
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
          return loadWithRetry(attempt + 1);
        }
        throw error;
      }
    };

    return loadWithRetry();
  },

  // Prefetch data for routes
  prefetchRouteData(route: string) {
    // Add route-specific data prefetching logic
  }
};