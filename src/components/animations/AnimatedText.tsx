import React from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0.1,
  step = 0.05,
}) => {
  const words = text.split(' ');

  return (
    <span className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.1em] ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block animate-fade-in-up transition-all duration-700"
          style={{
            animationDelay: `${delay + i * step}s`,
            animationFillMode: 'both',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

export default AnimatedText;
