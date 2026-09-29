import { useEffect, useRef } from "react";

type HeroPressureHeadingProps = {
  lines: string[];
  className?: string;
  id?: string;
};

const HeroPressureHeading = ({ lines, className = "", id }: HeroPressureHeadingProps) => {
  const rootRef = useRef<HTMLHeadingElement | null>(null);
  const cursor = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const frame = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-pressure-letter]"));
    let visible = true;

    const onPointerMove = (event: PointerEvent) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      if (visible && !frame.current) frame.current = requestAnimationFrame(draw);
    };
    const onPointerLeave = () => {
      const bounds = root.getBoundingClientRect();
      target.current.x = bounds.left + bounds.width / 2;
      target.current.y = bounds.top + bounds.height / 2;
      if (visible && !frame.current) frame.current = requestAnimationFrame(draw);
    };
    const draw = () => {
      frame.current = 0;
      if (!visible) return;
      cursor.current.x += (target.current.x - cursor.current.x) * .16;
      cursor.current.y += (target.current.y - cursor.current.y) * .16;
      const bounds = root.getBoundingClientRect();
      const maxDistance = Math.max(bounds.width * .38, 160);
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect();
        const distance = Math.hypot(cursor.current.x - (rect.left + rect.width / 2), cursor.current.y - (rect.top + rect.height / 2));
        const influence = Math.max(0, 1 - distance / maxDistance);
        const weight = Math.round(700 + influence * 200);
        const width = Math.round(92 + influence * 20);
        const slant = (influence * -4).toFixed(2);
        letter.style.fontVariationSettings = `'wght' ${weight}, 'wdth' ${width}, 'slnt' ${slant}`;
      });
      if (Math.abs(target.current.x - cursor.current.x) > .5 || Math.abs(target.current.y - cursor.current.y) > .5) frame.current = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) cancelAnimationFrame(frame.current);
    }, { threshold: .01 });
    const bounds = root.getBoundingClientRect();
    cursor.current.x = target.current.x = bounds.left + bounds.width / 2;
    cursor.current.y = target.current.y = bounds.top + bounds.height / 2;
    observer.observe(root);
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frame.current);
      observer.disconnect();
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <h1 id={id} ref={rootRef} className={`kh-hero-pressure ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line, lineIndex) => (
        <span className={`kh-hero-pressure__line ${lineIndex >= 2 ? "kh-hero-pressure__line--outline" : ""}`} key={`${line}-${lineIndex}`} aria-hidden="true">
          {Array.from(line).map((letter, index) => <span data-pressure-letter key={`${line}-${index}`}>{letter === " " ? "\u00a0" : letter}</span>)}
        </span>
      ))}
    </h1>
  );
};

export default HeroPressureHeading;
