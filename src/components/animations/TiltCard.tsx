import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  className?: string;
  children: React.ReactNode;
  maxTilt?: number; // in degrees
  glare?: boolean;
}

// Lightweight tilt effect with rAF and cleanup, respects reduced motion
const TiltCard: React.FC<TiltCardProps> = ({ className, children, maxTilt = 8, glare = false }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const rectCache = { left: 0, top: 0, width: 0, height: 0 };

    const updateRect = () => {
      const r = el.getBoundingClientRect();
      rectCache.left = r.left;
      rectCache.top = r.top;
      rectCache.width = r.width;
      rectCache.height = r.height;
    };

    updateRect();

    let hovering = false;

    const onEnter = () => {
      hovering = true;
      updateRect();
    };

    const onLeave = () => {
      hovering = false;
      if (frame.current) cancelAnimationFrame(frame.current);
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      if (glare) {
        const glareEl = el.querySelector('[data-tilt-glare]') as HTMLDivElement | null;
        if (glareEl) glareEl.style.opacity = '0';
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!hovering) return;
      const x = e.clientX - rectCache.left;
      const y = e.clientY - rectCache.top;
      const px = (x / Math.max(rectCache.width, 1)) * 2 - 1; // -1..1
      const py = (y / Math.max(rectCache.height, 1)) * 2 - 1;
      current.current.x = px;
      current.current.y = py;

      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rotX = (-py * maxTilt).toFixed(2);
        const rotY = (px * maxTilt).toFixed(2);
        el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
        if (glare) {
          const glareEl = el.querySelector('[data-tilt-glare]') as HTMLDivElement | null;
          if (glareEl) {
            const angle = Math.atan2(py, px) * (180 / Math.PI) + 180;
            const intensity = Math.min(1, Math.hypot(px, py));
            glareEl.style.opacity = String(0.25 + intensity * 0.35);
            glareEl.style.background = `conic-gradient(from ${angle}deg, rgba(255,255,255,0.35), rgba(255,255,255,0))`;
          }
        }
      });
    };

    const onResize = () => updateRect();

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, { passive: true });

    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [maxTilt, glare]);

  return (
    <div
      ref={ref}
      className={cn(
        'will-change-transform transition-transform duration-200 ease-out [transform-style:preserve-3d]',
        className
      )}
      style={{ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)' }}
    >
      {glare && (
        <div
          aria-hidden
          data-tilt-glare
          className="pointer-events-none absolute inset-0 opacity-0"
          style={{ mixBlendMode: 'screen', borderRadius: 'inherit' }}
        />
      )}
      {children}
    </div>
  );
};

export default TiltCard;
