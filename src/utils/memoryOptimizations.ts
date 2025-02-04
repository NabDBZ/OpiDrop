// Memory usage optimizations
export const memoryOptimizations = {
  // Clear unused memory
  clearUnusedMemory() {
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) {
        // Clear caches and unused resources
        resourceCache.clear();
        cacheManager.cleanExpiredCache();
      }
    }
  },

  // Monitor memory usage
  startMemoryMonitoring(threshold: number = 0.8) {
    if ('memory' in performance) {
      setInterval(() => {
        const memoryInfo = (performance as any).memory;
        const usage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        
        if (usage > threshold) {
          console.warn(`High memory usage: ${(usage * 100).toFixed(1)}%`);
          this.clearUnusedMemory();
        }
      }, 30000); // Check every 30 seconds
    }
  },

  // Optimize large lists
  optimizeList<T>(list: T[], pageSize: number = 50): {
    getPage: (page: number) => T[];
    totalPages: number;
  } {
    const totalPages = Math.ceil(list.length / pageSize);
    const pages = new Map<number, T[]>();

    return {
      getPage: (page: number) => {
        if (pages.has(page)) {
          return pages.get(page)!;
        }

        const start = page * pageSize;
        const end = Math.min(start + pageSize, list.length);
        const pageData = list.slice(start, end);
        
        pages.set(page, pageData);
        return pageData;
      },
      totalPages
    };
  }
};