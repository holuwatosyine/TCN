import { useEffect, useRef, type ReactNode } from "react";
import { experienceState } from "@/experience/state";

type InteractiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
};

/* Art-directed photo: graded toward the brand (cool, desaturated, warm highlight) and lit by the
   same gold "lantern" as the world. A finger or cursor moves the light and lets colour back in.
   Pure DOM + CSS variables: no extra WebGL context per image. */
export const InteractiveImage = ({ src, alt, className = "", imageClassName = "", children }: InteractiveImageProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || experienceState.reducedMotion) return;
    let timer = 0;
    const move = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      root.style.setProperty("--mx", `${((event.clientX - rect.left) / Math.max(1, rect.width)) * 100}%`);
      root.style.setProperty("--my", `${((event.clientY - rect.top) / Math.max(1, rect.height)) * 100}%`);
    };
    const press = (event: PointerEvent) => {
      move(event);
      root.dataset.lit = "true";
      window.clearTimeout(timer);
      if (event.pointerType !== "mouse") timer = window.setTimeout(() => { delete root.dataset.lit; }, 2200);
    };
    const leave = () => { delete root.dataset.lit; };
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerdown", press, { passive: true });
    root.addEventListener("pointerenter", press, { passive: true });
    root.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      window.clearTimeout(timer);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerdown", press);
      root.removeEventListener("pointerenter", press);
      root.removeEventListener("pointerleave", leave);
    };
  }, [src]);

  return (
    <div ref={rootRef} className={`kh-interactive-image ${className}`} data-cursor="image">
      <div className="kh-interactive-image__plane">
        <img ref={undefined} src={src} alt={alt} className={imageClassName} loading="eager" decoding="async" />
        <span className="kh-interactive-image__lantern" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
};

export default InteractiveImage;
