// Performance optimization utilities
import { useCallback, useEffect, useMemo, useRef } from 'react';

// Debounce hook for search and filter operations
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Memoized drug filtering
export function useFilteredDrugs(drugs: DrugType[], searchQuery: string, category: string | null) {
  return useMemo(() => {
    const query = searchQuery.toLowerCase();
    return drugs.filter(drug => {
      if (category && drug.effect !== category) return false;
      if (!query) return true;
      
      return (
        drug.name.toLowerCase().includes(query) ||
        drug.brandName?.toLowerCase().includes(query) ||
        drug.effect.toLowerCase().includes(query)
      );
    });
  }, [drugs, searchQuery, category]);
}

// Intersection Observer hook for lazy loading
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
}

// Local storage with expiration
export const storage = {
  set: (key: string, value: any, expirationInMinutes: number = 60) => {
    const item = {
      value,
      timestamp: new Date().getTime(),
      expiration: expirationInMinutes * 60 * 1000
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get: (key: string) => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { value, timestamp, expiration } = JSON.parse(item);
    const now = new Date().getTime();

    if (now - timestamp > expiration) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  }
};

// Virtual list renderer for large datasets
export function VirtualList<T>({ 
  items, 
  renderItem, 
  height, 
  itemHeight 
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  height: number;
  itemHeight: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleItems = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(height / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);

    return items.slice(start, end).map((item, index) => ({
      item,
      index: start + index
    }));
  }, [items, scrollTop, height, itemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Request animation frame based scroll handler
export function useScrollHandler(callback: () => void) {
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        callback();
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, [callback]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
}

// Efficient event delegation handler
export function createEventDelegator(
  container: HTMLElement,
  selector: string,
  eventType: string,
  handler: (e: Event, element: HTMLElement) => void
) {
  container.addEventListener(eventType, (e) => {
    const target = e.target as HTMLElement;
    const element = target.closest(selector) as HTMLElement;
    if (element) {
      handler(e, element);
    }
  });
}