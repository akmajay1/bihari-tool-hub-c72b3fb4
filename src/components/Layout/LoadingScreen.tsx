
import React, { useEffect, useState } from 'react';
import AnimatedText from '../UI/AnimatedText';

interface LoadingScreenProps {
  onFinish?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Increment progress 
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            if (onFinish) setTimeout(onFinish, 400); // Short delay before calling onFinish
            return 100;
          }
          return prev + 1;
        });
      }, 20); // 2 seconds total (20ms * 100)
      
      return () => clearInterval(interval);
    }, 1000); // Wait 1s before starting
    
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <AnimatedText 
          text="BihariTool" 
          className="text-5xl font-bold text-apple-black mb-8" 
          delay={500} 
          letterDelay={80}
        />
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-apple-blue transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
