// Enhanced animation utilities
import { useSpring, useTransition, config } from '@react-spring/web';

// Smooth scroll with acceleration and deceleration
export function smoothScroll(element: HTMLElement, to: number, duration: number = 500) {
  const start = element.scrollTop;
  const change = to - start;
  const startTime = performance.now();

  function easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    element.scrollTop = start + change * easeInOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// Optimized parallax effect
export function useParallax(scrollY: number, speed: number = 0.5) {
  return useSpring({
    transform: `translate3d(0, ${scrollY * speed}px, 0)`,
    config: { tension: 170, friction: 26 }
  });
}

// Smooth fade transitions
export function useFadeTransition(show: boolean) {
  return useTransition(show, {
    from: { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
    enter: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    leave: { opacity: 0, transform: 'translate3d(0, -20px, 0)' },
    config: config.gentle
  });
}

// Optimized wave animation
export function useWaveAnimation(index: number, baseDelay: number = 0) {
  return useSpring({
    from: { transform: 'translateX(0%)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateX(-50%)' });
        await next({ transform: 'translateX(0%)' });
      }
    },
    config: {
      duration: 3000 + index * 500,
      tension: 120,
      friction: 14
    },
    delay: baseDelay + index * 200
  });
}