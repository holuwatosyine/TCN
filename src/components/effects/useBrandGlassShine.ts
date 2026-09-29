import { useEffect } from "react";

/**
 * Brandstewards glass interaction: track the pointer inside marked glass
 * surfaces and liquid buttons without creating per-element animation loops.
 */
export function useBrandGlassShine() {
  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>("[data-brand-glass], .kh-liquid-button");
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      element.style.setProperty("--brand-mx", `${x}px`);
      element.style.setProperty("--brand-my", `${y}px`);
      element.style.setProperty("--pointer-xp", `${(x / Math.max(rect.width, 1)) * 100}%`);
      element.style.setProperty("--pointer-yp", `${(y / Math.max(rect.height, 1)) * 100}%`);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => document.removeEventListener("mousemove", onMove);
  }, []);
}

export default useBrandGlassShine;

// Ported from holuwatosyine/brandstewards/src/useGlassShine.ts.
// The selector is namespaced to avoid changing unrelated legacy glass cards.
