
import React, { useEffect, useRef } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number; // Delay before starting the animation in ms
  letterDelay?: number; // Delay between letters in ms
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  letterDelay = 50
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const letters = container.querySelectorAll('.text-animation-letter');

    letters.forEach((letter, index) => {
      setTimeout(() => {
        letter.classList.add('animate-text-reveal');
      }, delay + index * letterDelay);
    });
  }, [text, delay, letterDelay]);

  return (
    <div className={`text-animation-container ${className}`} ref={containerRef}>
      {text.split('').map((letter, index) => (
        <span key={`${letter}-${index}`} className="text-animation-letter">
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
