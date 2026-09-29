import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LogoImage from "@/assets/kingshill-logo-official.webp";
import "@/components/site.css";
import "@/experience/AscentExperience.css";

const items = [
  { label: "About", href: "/about" },
  { label: "Training", href: "/training" },
  { label: "Faculty", href: "/faculty" },
  { label: "Resources", href: "/resources" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

const MagneticDock = () => {
  const dockRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const buttons = Array.from(dock.querySelectorAll<HTMLElement>("[data-dock-item]"));

    const reset = () => buttons.forEach((button) => {
      button.style.setProperty("--dock-scale", "1");
      button.style.setProperty("--dock-y", "0px");
      button.style.setProperty("--dock-bright", "0");
    });

    const move = (event: PointerEvent) => {
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        const distance = Math.abs(event.clientX - (rect.left + rect.width / 2));
        const influence = Math.max(0, 1 - distance / 150);
        const amount = influence * influence * (3 - 2 * influence);
        button.style.setProperty("--dock-scale", String(1 + amount * .14));
        button.style.setProperty("--dock-y", `${amount * 4}px`);
        button.style.setProperty("--dock-bright", String(amount));
      });
    };

    dock.addEventListener("pointermove", move, { passive: true });
    dock.addEventListener("pointerleave", reset, { passive: true });
    return () => {
      dock.removeEventListener("pointermove", move);
      dock.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <header className="kh-dock-header">
      <Link to="/" className="kh-dock-mark" aria-label="Kingshill School of Discovery home">
        <img src={LogoImage} alt="" />
        <span><strong>Kingshill</strong><small>School of Discovery</small></span>
      </Link>
      <nav ref={dockRef} className="kh-dock" aria-label="Primary navigation" data-brand-glass>
        {items.map((item, index) => <Link key={item.href} to={item.href} data-dock-item onClick={() => setMobileOpen(false)} className={location.pathname === item.href ? "is-active" : ""}><small>{String(index + 1).padStart(2, "0")}</small><span>{item.label}</span></Link>)}
      </nav>
      <Link className="kh-dock-contact" to="/contact">Begin here <span aria-hidden="true">↗</span></Link>
      <button className="kh-dock-menu" type="button" aria-expanded={mobileOpen} aria-controls="kh-mobile-menu" onClick={() => setMobileOpen((open) => !open)}>{mobileOpen ? "Close" : "Menu"}</button>
      {mobileOpen && <nav id="kh-mobile-menu" className="kh-dock-mobile" aria-label="Mobile navigation">{items.map((item, index) => <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)} className={location.pathname === item.href ? "is-active" : ""}><span>{String(index + 1).padStart(2, "0")}</span>{item.label}<b aria-hidden="true">↗</b></Link>)}</nav>}
    </header>
  );
};

export default MagneticDock;
