import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ParallaxBackground } from './components/ParallaxBackground';
import { ErrorBoundary } from './utils/errorBoundary';
import { DebugMonitor } from './utils/debugMonitor';
import { Toaster } from 'react-hot-toast';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const CalendarTool = lazy(() => import('./pages/CalendarTool'));
const UserGuidePage = lazy(() => import('./pages/UserGuidePage').then(module => ({ default: module.UserGuidePage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage').then(module => ({ default: module.ArticlesPage })));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage').then(module => ({ default: module.TermsOfServicePage })));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="glass-card p-8">
      <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  
  const getParallaxVariant = () => {
    switch (location.pathname) {
      case '/calendar-tool': return 'tool';
      case '/user-guide': return 'guide';
      case '/articles': return 'articles';
      case '/contact': return 'contact';
      case '/terms-of-service': return 'legal';
      default: return 'tool';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParallaxBackground variant={getParallaxVariant()} />
      <Header />
      <main className="flex-grow pt-14">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/calendar-tool" element={<CalendarTool />} />
              <Route path="/user-guide" element={<UserGuidePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      {process.env.NODE_ENV === 'development' && <DebugMonitor />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass-card',
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;