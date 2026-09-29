import { useEffect, useRef, type ReactNode } from "react";
import { experienceState } from "@/experience/state";
import { createKageCloth } from "@/components/effects/kageCloth";

type InteractiveImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
};

const drawCoverPlate = (image: HTMLImageElement, width: number, height: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  const context = canvas.getContext("2d");
  if (!context) return null;
  const scale = Math.max(canvas.width / Math.max(1, image.naturalWidth), canvas.height / Math.max(1, image.naturalHeight));
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
  return canvas;
};

export const InteractiveImage = ({ src, alt, className = "", imageClassName = "", children }: InteractiveImageProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!root || !canvas || !image || experienceState.reducedMotion) return;
    let disposed = false;
    let cloth: ReturnType<typeof createKageCloth> = null;
    let plate: HTMLCanvasElement | null = null;
    let plateWidth = 0;
    let plateHeight = 0;

    const getPlate = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.65);
      const width = Math.max(1, Math.round(root.clientWidth * dpr));
      const height = Math.max(1, Math.round(root.clientHeight * dpr));
      if (!plate || width !== plateWidth || height !== plateHeight) {
        plate = drawCoverPlate(image, width, height);
        plateWidth = width;
        plateHeight = height;
      }
      return plate;
    };

    const start = () => {
      if (disposed || cloth || !image.complete || !image.naturalWidth) return;
      cloth = createKageCloth(canvas, root, getPlate);
      if (cloth) root.dataset.imageReady = "true";
    };
    image.addEventListener("load", start, { once: true });
    start();
    return () => {
      disposed = true;
      image.removeEventListener("load", start);
      cloth?.dispose();
      delete root.dataset.imageReady;
    };
  }, [src]);

  return (
    <div ref={rootRef} className={`kh-interactive-image ${className}`} data-cursor="image">
      <div className="kh-interactive-image__plane">
        <canvas ref={canvasRef} className="kh-kage-cloth" aria-hidden="true" />
        <img ref={imageRef} src={src} alt={alt} className={imageClassName} loading="lazy" decoding="async" />
        {children}
      </div>
    </div>
  );
};

export default InteractiveImage;
