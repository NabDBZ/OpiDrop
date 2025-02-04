import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

// Prevent unnecessary re-renders
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: any[] = []
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, []);
}

// Batch updates for better performance
export function useBatchUpdate<T>(
  initialState: T[],
  batchSize: number = 10
): [T[], (updates: Partial<T>[]) => void] {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>[]>([]);
  const timeoutRef = useRef<number>();

  const applyUpdates = useCallback(() => {
    setState(current => {
      const updates = pendingUpdates.current;
      pendingUpdates.current = [];
      
      return current.map((item, index) => ({
        ...item,
        ...updates[index]
      }));
    });
  }, []);

  const queueUpdate = useCallback((updates: Partial<T>[]) => {
    pendingUpdates.current.push(...updates);

    if (pendingUpdates.current.length >= batchSize) {
      window.clearTimeout(timeoutRef.current);
      requestAnimationFrame(applyUpdates);
    } else {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        requestAnimationFrame(applyUpdates);
      }, 16);
    }
  }, [applyUpdates, batchSize]);

  useEffect(() => {
    return () => window.clearTimeout(timeoutRef.current);
  }, []);

  return [state, queueUpdate];
}

// Optimized virtualized list hook
export function useVirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3
}: {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrolling = useRef(false);
  const rafId = useRef<number>();

  const visibleItems = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return items
      .slice(startIndex, endIndex)
      .map((item, index) => ({
        item,
        index: startIndex + index,
        style: {
          position: 'absolute',
          top: (startIndex + index) * itemHeight,
          height: itemHeight,
          width: '100%',
          transform: 'translate3d(0, 0, 0)',
          willChange: scrolling.current ? 'transform' : 'auto'
        }
      }));
  }, [items, scrollTop, containerHeight, itemHeight, overscan]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!scrolling.current) {
      scrolling.current = true;
      e.currentTarget.style.pointerEvents = 'none';
    }

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      setScrollTop(e.currentTarget.scrollTop);
      scrolling.current = false;
      e.currentTarget.style.pointerEvents = 'auto';
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return {
    containerStyle: {
      height: containerHeight,
      overflow: 'auto',
      position: 'relative' as const,
      WebkitOverflowScrolling: 'touch',
      willChange: scrolling.current ? 'transform' : 'auto'
    },
    contentStyle: {
      height: items.length * itemHeight,
      position: 'relative' as const
    },
    visibleItems,
    handleScroll
  };
}

// Optimized window resize handler
export function useWindowResize(callback: (width: number, height: number) => void) {
  const rafId = useRef<number>();
  
  useEffect(() => {
    const handleResize = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      
      rafId.current = requestAnimationFrame(() => {
        callback(window.innerWidth, window.innerHeight);
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [callback]);
}