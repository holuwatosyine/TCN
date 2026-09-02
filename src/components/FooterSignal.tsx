import { useEffect, useRef } from "react";

type Signal = { x: number; y: number; vx: number; vy: number; size: number; alpha: number };

const FooterSignal = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    const particles: Signal[] = [];
    const seed = (count: number) => {
      particles.length = 0;
      for (let index = 0; index < count; index += 1) particles.push({ x: Math.random() * width, y: Math.random() * height * .58, vx: .16 + Math.random() * .38, vy: (Math.random() - .5) * .1, size: .35 + Math.random() * 1.1, alpha: .13 + Math.random() * .35 });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(width < 600 ? 80 : 180);
    };
    const draw = (now: number) => {
      if (!visible) { raf = 0; return; }
      if (now - last < (reduced ? 1000 : 33)) { raf = requestAnimationFrame(draw); return; }
      last = now;
      context.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy + Math.sin(particle.x * .008 + now * .0004) * .06;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10 || particle.y > height * .7) particle.y = Math.random() * height * .4;
        const dx = particle.x - pointerX;
        const dy = particle.y - pointerY;
        const distance = Math.hypot(dx, dy);
        const deflect = distance < 140 && !reduced ? (1 - distance / 140) * .7 : 0;
        const x = particle.x + (dx / Math.max(distance, 1)) * deflect * 18;
        const y = particle.y + (dy / Math.max(distance, 1)) * deflect * 12;
        context.fillStyle = "rgba(45, 54, 35, " + particle.alpha + ")";
        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    const onPointer = (event: PointerEvent) => { pointerX = event.clientX; pointerY = event.clientY; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(draw); }, { rootMargin: "160px 0px" });
    observer.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    resize();
    return () => { cancelAnimationFrame(raf); observer.disconnect(); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onPointer); };
  }, []);

  return <canvas ref={canvasRef} className="kh-footer-signal" aria-hidden="true" />;
};

export default FooterSignal;
