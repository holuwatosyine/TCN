import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
        window.scrollTo(0, 0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        transitionStage === 'fadeIn'
          ? 'opacity-100 translate-y-0 filter-none'
          : 'opacity-0 translate-y-4 blur-sm'
      }`}
    >
      {children}
    </div>
  );
};

export default PageTransition;
