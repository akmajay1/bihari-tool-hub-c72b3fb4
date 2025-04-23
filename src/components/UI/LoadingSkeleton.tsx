
import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  count = 1
}) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <div key={i} className={`loading-skeleton ${className}`} />
        ))}
    </>
  );
};

export default LoadingSkeleton;
