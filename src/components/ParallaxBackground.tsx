import React, { useEffect, useState, useCallback } from 'react';

type ParallaxBackgroundProps = {
  variant?: 'tool' | 'guide' | 'articles' | 'contact';
  className?: string;
};

export function ParallaxBackground({ variant = 'tool', className = '' }: ParallaxBackgroundProps) {
  const [offset, setOffset] = useState(0);

  const themeConfig = {
    tool: {
      primary: '#1E40AF',
      secondary: '#4338CA'
    },
    guide: {
      primary: '#065F46',
      secondary: '#115E59'
    },
    articles: {
      primary: '#5B21B6',
      secondary: '#7E22CE'
    },
    contact: {
      primary: '#B45309',
      secondary: '#C2410C'
    }
  };

  // Optimized scroll handler with RAF and throttling
  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition = 0;
    let rafId: number;

    const handleScroll = () => {
      lastKnownScrollPosition = window.pageYOffset;

      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          setOffset(lastKnownScrollPosition * 0.2);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const config = themeConfig[variant];

  // Reduced number of waves and simplified animation
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      <div 
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: `linear-gradient(135deg, ${config.primary}, ${config.secondary})`
        }}
      />

      {/* Single optimized wave effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(transparent, rgba(255,255,255,0.2))',
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform'
        }}
      />

      {/* Optimized gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/80"
        style={{ 
          transform: `translateY(${offset * 0.1}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform'
        }}
      />
    </div>
  );
}