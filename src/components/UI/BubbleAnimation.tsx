
import React, { useEffect, useRef } from 'react';

const BubbleAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create bubbles
    const createBubble = () => {
      const bubble = document.createElement('div');
      bubble.className = 'absolute rounded-full bg-white/10 backdrop-blur-sm border border-white/20 animate-float';
      
      // Random size between 30px and 120px
      const size = Math.random() * 90 + 30;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      
      // Random horizontal position
      const posX = Math.random() * 100;
      bubble.style.left = `${posX}%`;
      
      // Start below the viewport
      bubble.style.bottom = `-${size}px`;
      
      // Zigzag animation
      const zigzagAmount = Math.random() * 40 - 20; // between -20% and 20%
      bubble.style.animation = `float ${Math.random() * 8 + 12}s linear infinite, zigzag ${Math.random() * 5 + 5}s ease-in-out infinite alternate`;
      bubble.style.animationDelay = `${Math.random() * 5}s`;
      bubble.style.transform = `translateX(${zigzagAmount}%)`;
      
      // Append bubble to container
      container.appendChild(bubble);
      
      // Remove bubble after animation completes
      setTimeout(() => {
        if (container.contains(bubble)) {
          container.removeChild(bubble);
        }
      }, 20000);
    };

    // Create initial set of bubbles
    for (let i = 0; i < 10; i++) {
      setTimeout(createBubble, i * 1000);
    }

    // Create new bubbles periodically
    const interval = setInterval(createBubble, 3000);

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
