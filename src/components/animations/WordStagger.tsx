import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface WordStaggerProps {
  text: string;
  className?: string;
  delayStart?: number; // seconds
  step?: number; // seconds per word
}

const WordStagger: React.FC<WordStaggerProps> = ({ text, className, delayStart = 0.1, step = 0.06 }) => {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);
  return (
    <span className={cn("inline", className)} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={cn("inline-block animate-fade-in-up", i < words.length - 1 ? "mr-1" : "")}
          style={{ animationDelay: `${(delayStart + i * step).toFixed(2)}s` }}
        >
          {w}
        </span>
      ))}
    </span>
  );
};

export default WordStagger;
