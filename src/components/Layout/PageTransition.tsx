
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSkeleton from '../UI/LoadingSkeleton';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // When location changes, show loading state
    setIsLoading(true);
    
    // Short timeout to show loading skeleton
    const timeout = setTimeout(() => {
      setDisplayChildren(children);
      
      // After a brief delay to allow new content to render, hide loading state
      setTimeout(() => setIsLoading(false), 100);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [location.pathname, children]);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 app-container fade-in">
        <div className="mb-12">
          <LoadingSkeleton className="h-12 w-1/3 mb-4 mx-auto" />
          <LoadingSkeleton className="h-6 w-2/3 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, index) => (
            <LoadingSkeleton key={index} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  return <>{displayChildren}</>;
};

export default PageTransition;
