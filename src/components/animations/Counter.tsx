import React, { useEffect, useMemo, useRef, useState } from "react";

interface CounterProps {
  end: number;
  duration?: number; // ms
  decimals?: number; // number of decimal places
  prefix?: string;
  suffix?: string;
  className?: string;
  format?: 'comma' | 'none';
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const Counter: React.FC<CounterProps> = ({
  end,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  format = 'comma',
}) => {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  const formatter = useMemo(() => {
    if (format === 'comma') {
      return new Intl.NumberFormat(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    return new Intl.NumberFormat(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: false });
  }, [decimals, format]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(end);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = easeOutCubic(t);
            setValue(end * eased);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.2 });

    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  const formatted = formatter.format(value);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default Counter;
