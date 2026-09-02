import { useEffect } from "react";

export default function useMagnetic<T extends HTMLElement>(ref: React.RefObject<T>, strength = 12) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let frame: number | null = null;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tx = (x / (rect.width / 2)) * strength;
      const ty = (y / (rect.height / 2)) * strength;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px)`;
      });
    };

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = 'translate(0px, 0px)';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ref, strength]);
}
