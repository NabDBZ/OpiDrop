// Performance optimization utilities
export const performanceOptimizations = {
  // Debounce function with RAF
  debounceWithRAF: (fn: Function) => {
    let rafId: number;
    return (...args: any[]) => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => fn(...args));
    };
  },

  // Throttle function
  throttle: (fn: Function, limit: number) => {
    let inThrottle: boolean;
    return (...args: any[]) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Intersection Observer for lazy loading
  createIntersectionObserver: (callback: IntersectionObserverCallback, options = {}) => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0,
      ...options
    });
  },

  // Memory cleanup
  cleanupMemory: () => {
    if (window.performance && performance.memory) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
        // Clear image cache
        const images = document.getElementsByTagName('img');
        for (let i = 0; i < images.length; i++) {
          if (!images[i].classList.contains('critical')) {
            images[i].src = '';
          }
        }
        
        // Clear local storage cache
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
          }
        });
      }
    }
  }
};