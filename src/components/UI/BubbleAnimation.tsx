
import React, { useEffect, useRef } from 'react';

const BubbleAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create bubbles
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full bg-white/5 backdrop-blur-sm border border-white/10 animate-float';
      
      // Random size between 20px and 100px
      const size = Math.random() * 80 + 20;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random horizontal position across full width
      const posX = Math.random() * 100;
      bubble.style.left = `${posX}%`;
      
      // Start below the viewport
      bubble.style.bottom = `-${size}px`;
      
      // Enhanced zigzag animation
      const zigzagAmount = Math.random() * 60 - 30; // between -30% and 30%
      bubble.style.animation = `float ${Math.random() * 10 + 8}s linear infinite, zigzag ${Math.random() * 4 + 3}s ease-in-out infinite alternate`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      bubble.style.transform = `translateX(${zigzagAmount}%)`;
      
      container.appendChild(bubble);
      
      // Remove bubble after animation
      setTimeout(() => {
        if (container.contains(bubble)) {
          container.removeChild(bubble);
        }
      }, 18000);
    };

    // Create initial set of bubbles (more bubbles)
    for (let i = 0; i < 20; i++) {
      setTimeout(createBubble, i * 500);
    }

    // Create new bubbles more frequently
    const interval = setInterval(createBubble, 1500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
    />
  );
};

export default BubbleAnimation;
