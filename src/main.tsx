import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { resourceLoader } from './utils/resourceLoader';
import { memoryOptimizations } from './utils/memoryOptimizations';
import { cacheManager } from './utils/caching';

// Initialize optimizations
resourceLoader.preloadCriticalResources();
memoryOptimizations.startMemoryMonitoring();
cacheManager.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);