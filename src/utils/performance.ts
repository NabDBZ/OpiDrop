// Performance monitoring utilities
export const performanceMonitor = {
  // Start timing
  startTiming(label: string) {
    performance.mark(`${label}_start`);
  },

  // End timing and log result
  endTiming(label: string) {
    performance.mark(`${label}_end`);
    performance.measure(label, `${label}_start`, `${label}_end`);
    
    const measurements = performance.getEntriesByName(label);
    const duration = measurements[0].duration;
    
    if (duration > 100) {
      console.warn(`Performance warning: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    performance.clearMarks();
    performance.clearMeasures();
    
    return duration;
  },

  // Monitor component render time
  monitorRender(componentName: string, callback: () => void) {
    this.startTiming(`render_${componentName}`);
    callback();
    return this.endTiming(`render_${componentName}`);
  },

  // Monitor data loading
  monitorDataLoading(label: string, promise: Promise<any>) {
    this.startTiming(`load_${label}`);
    return promise.finally(() => this.endTiming(`load_${label}`));
  }
};

// Performance optimization hooks
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    performanceMonitor.startTiming(`mount_${componentName}`);
    return () => performanceMonitor.endTiming(`mount_${componentName}`);
  }, [componentName]);
}

// Lazy loading image component
export function LazyImage({ src, alt, className }: { 
  src: string; 
  alt: string; 
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
    />
  );
}