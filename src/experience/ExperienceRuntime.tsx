import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AscentWorld from "@/experience/AscentWorld";
import useBrandGlassShine from "@/components/effects/useBrandGlassShine";
import "@/experience/AscentExperience.css";
import { experienceState } from "@/experience/state";

gsap.registerPlugin(ScrollTrigger);

const routeToken = (pathname: string) => pathname === "/" ? "home" : pathname.replace(/^\//, "").replace(/[^a-z0-9-]/gi, "-") || "home";

const ExperienceRuntime = () => {
  const location = useLocation();
  useBrandGlassShine();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const lenis = reducedMotion ? null : new Lenis({
      lerp: .082,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: .82,
      touchMultiplier: 1.03,
    });

    const updateScroll = (event?: { scroll: number; limit: number; velocity: number; direction: number }) => {
      const scroll = event?.scroll ?? window.scrollY;
      const limit = event?.limit ?? Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      experienceState.setScroll(scroll, scroll / Math.max(1, limit), event?.velocity ?? 0, event?.direction ?? 1);
      root.style.setProperty("--kh-scroll-progress", String(experienceState.scroll.progress));
      root.style.setProperty("--kh-scroll-velocity", String(Math.min(1, Math.abs(experienceState.scroll.velocity) / 120)));
      ScrollTrigger.update();
    };

    const onNativeScroll = () => updateScroll();
    const onPointerMove = (event: PointerEvent) => {
      experienceState.updatePointer(event.clientX, event.clientY, event.pointerType || "mouse");
      root.style.setProperty("--kh-pointer-x", `${event.clientX}px`);
      root.style.setProperty("--kh-pointer-y", `${event.clientY}px`);
      const target = event.target as Element | null;
      const interactive = target?.closest("a, button, [data-cursor]");
      root.dataset.khCursor = interactive?.getAttribute("data-cursor") || (interactive ? "interactive" : "default");
    };
    const onPointerDown = (event: PointerEvent) => {
      experienceState.updatePointer(event.clientX, event.clientY, event.pointerType || "mouse");
      experienceState.pointer.pressed = true;
      root.dataset.khPointerDown = "true";
    };
    const onPointerUp = () => {
      experienceState.pointer.pressed = false;
      root.dataset.khPointerDown = "false";
    };
    const onVisibility = () => {
      if (document.hidden) gsap.ticker.sleep();
      else gsap.ticker.wake();
    };
    const onAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      const href = anchor?.getAttribute("href");
      const target = href ? document.querySelector<HTMLElement>(href) : null;
      if (!target) return;
      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.08 });
      else target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    };
    const ticker = (time: number) => {
      lenis?.raf(time * 1000);
      experienceState.tick(gsap.ticker.deltaRatio(60) / 60);
    };

    if (lenis) lenis.on("scroll", updateScroll);
    else window.addEventListener("scroll", onNativeScroll, { passive: true });
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    gsap.ticker.add(ticker);
    updateScroll();

    return () => {
      lenis?.destroy();
      if (lenis) lenis.off("scroll", updateScroll);
      else window.removeEventListener("scroll", onNativeScroll);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.remove(ticker);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.khRoute = routeToken(location.pathname);
    root.dataset.khRouteTransition = "true";
    window.scrollTo({ top: 0, behavior: "auto" });
    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh());
    const clearTransition = window.setTimeout(() => { delete root.dataset.khRouteTransition; }, 940);
    return () => {
      cancelAnimationFrame(refresh);
      window.clearTimeout(clearTransition);
    };
  }, [location.pathname]);

  return (
    <>
      <AscentWorld pathname={location.pathname} />
    </>
  );
};

export default ExperienceRuntime;
