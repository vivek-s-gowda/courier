import React, { useState, useEffect } from 'react';
import App from './App';
import LandingPage from './landing/LandingPage';

export default function Root() {
  const getInitialRoute = () => {
    // If running inside Electron desktop app, go straight to /app
    if (typeof window !== 'undefined' && window.courierDesktop?.isElectron) {
      return '/app';
    }
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/app' || path.startsWith('/app/')) {
        return '/app';
      }
    }
    return '/';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/app' || path.startsWith('/app/')) {
        setCurrentRoute('/app');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentRoute(path);
      window.scrollTo(0, 0);
    }
  };

  if (currentRoute === '/app') {
    return <App />;
  }

  return <LandingPage onLaunchApp={() => navigate('/app')} />;
}
