import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import { Shader } from "shaders/react";
import { experienceState } from "@/experience/state";

type ShaderSurfaceProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/**
 * The shader package owns WebGPU initialization and visibility. This wrapper only
 * keeps the DOM canvas backing store aligned with its real CSS rectangle after
 * the package has initialized and after responsive layout changes.
 */
export default function ShaderSurface({ children, className, style }: ShaderSurfaceProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const syncCanvas = () => {
      const canvas = root.querySelector<HTMLCanvasElement>('canvas[data-renderer="shaders"]');
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const qualityCap = experienceState.quality === "high" ? 1.5 : experienceState.quality === "medium" ? 1.25 : 1.1;
      const dpr = Math.min(window.devicePixelRatio || 1, qualityCap * experienceState.renderScale);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    };
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { frame = 0; syncCanvas(); });
    };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(root);
    const mutationObserver = new MutationObserver(schedule);
    mutationObserver.observe(root, { childList: true, subtree: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("kingshill:render-scale", schedule);
    schedule();
    const delayed = window.setTimeout(schedule, 300);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(delayed);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("kingshill:render-scale", schedule);
    };
  }, []);

  return (
    <div ref={rootRef} className="kh-shader-surface" style={style} aria-hidden="true">
      <Shader className={className} disableTelemetry colorSpace="srgb" toneMapping="linear">
        {children}
      </Shader>
    </div>
  );
}
