import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type UIEvent } from "react";
import CorporatePageFrame from "@/components/CorporatePageFrame";
import galleryImage1 from "@/assets/img-20250827-wa0012.jpg";
import galleryImage2 from "@/assets/img-20250827-wa0010.jpg";
import galleryImage3 from "@/assets/img-20250827-wa0009.jpg";
import galleryImage4 from "@/assets/img-20250827-wa0023.jpg";
import galleryImage5 from "@/assets/img-20250827-wa0024.jpg";
import galleryImage6 from "@/assets/img-20250827-wa0020-1.jpg";
import "@/experience/AscentExperience.css";

const gallery = [
  ["Graduation Ceremony 2024", "Celebrating our latest cohort of certified life coaches", galleryImage1, "December 2024 · Lagos"],
  ["Corporate Training Workshop", "Executive coaching training for business leaders", galleryImage2, "November 2024 · Abuja"],
  ["Youth Empowerment Program", "Empowering young Nigerians through coaching skills", galleryImage3, "October 2024 · Kano"],
  ["Business Leaders Forum", "Networking and knowledge sharing among business leaders", galleryImage4, "September 2024 · Port Harcourt"],
  ["NLP Master Class", "Advanced NLP techniques for experienced practitioners", galleryImage5, "August 2024 · Ibadan"],
  ["Women in Coaching Summit", "Empowering women coaches across Nigeria", galleryImage6, "July 2024 · Lagos"],
] as const;

const Gallery = () => {
  const railRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });
  const scrollFrame = useRef(0);
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState<number | null>(null);

  useEffect(() => {
    if (focused === null) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setFocused(null); };
    document.documentElement.dataset.khGalleryOpen = "true";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      delete document.documentElement.dataset.khGalleryOpen;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [focused]);

  const updateActive = () => {
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + rail.clientWidth * .5;
    const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-gallery-card]"));
    let next = 0;
    let nearest = Infinity;
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth * .5;
      const distance = Math.abs(cardCenter - center);
      if (distance < nearest) { nearest = distance; next = index; }
    });
    setActive(next);
    const max = Math.max(1, rail.scrollWidth - rail.clientWidth);
    rail.style.setProperty("--gallery-progress", String(rail.scrollLeft / max));
  };

  const onScroll = (_event: UIEvent<HTMLDivElement>) => {
    cancelAnimationFrame(scrollFrame.current);
    scrollFrame.current = requestAnimationFrame(updateActive);
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const rail = railRef.current;
    if (!rail) return;
    dragRef.current = { active: true, startX: event.clientX, startScroll: rail.scrollLeft };
    rail.setPointerCapture(event.pointerId);
    rail.dataset.dragging = "true";
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !dragRef.current.active || event.pointerType === "touch") return;
    rail.scrollLeft = dragRef.current.startScroll - (event.clientX - dragRef.current.startX) * 1.18;
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || event.pointerType === "touch") return;
    dragRef.current.active = false;
    delete rail.dataset.dragging;
    try { rail.releasePointerCapture(event.pointerId); } catch { /* pointer capture may already be released */ }
    updateActive();
  };

  return (
    <CorporatePageFrame pageNumber="06" eyebrow="Gallery & stories" title={<>A community in <em>motion.</em></>} intro="A look at the people, rooms, and moments that make the Kingshill learning community real.">
      <section className="kh-cp-section kh-cp-section--paper kh-gallery-film">
        <div className="kh-cp-shell">
          <div className="kh-cp-section__head kh-cp-reveal"><div className="kh-cp-section__label"><span>01</span><span>Video highlights</span></div><div><h2>See the work in the room.</h2><p>From the first question to the final certificate, the work is practical, human, and shared.</p></div></div>
          <article className="kh-gallery-film__feature kh-cp-reveal">
            <div className="kh-gallery-film__copy"><span>01 / Film</span><h3>Kingshill School of Discovery Overview</h3><p>Discover our journey and impact across Nigeria.</p><div><span>School overview</span><span>5:30</span></div></div>
            <div className="kh-gallery-film__media" data-brand-glass><video controls playsInline preload="metadata" poster="/IMG-20250827-WA0018.webp"><source src="/VID-20250827-WA0025.mp4" type="video/mp4" />Your browser does not support video playback.</video></div>
          </article>
        </div>
      </section>

      <section className="kh-cp-section kh-cp-section--ink kh-gallery-archive">
        <div className="kh-cp-shell">
          <div className="kh-cp-section__head kh-cp-reveal"><div className="kh-cp-section__label"><span>02</span><span>Photo archive</span></div><div><h2>People make the picture.</h2><p>Swipe through the rooms, events, workshops, and everyday work of building better futures together.</p></div></div>
          <div className="kh-gallery-archive__status"><span>Archive / 06</span><strong>{String(active + 1).padStart(2, "0")}</strong><span>Swipe · Drag</span></div>
        </div>

        <div
          ref={railRef}
          className="kh-gallery-rail"
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="kh-gallery-rail__spacer" aria-hidden="true" />
          {gallery.map(([title, description, image, meta], index) => (
            <button
              type="button"
              data-gallery-card
              className={`kh-gallery-card ${active === index ? "is-active" : ""}`}
              key={title}
              onClick={() => setFocused(index)}
              aria-label={`Open ${title}`}
            >
              <span className="kh-gallery-card__image"><img src={image} alt="" loading="lazy" decoding="async" /></span>
              <span className="kh-gallery-card__meta"><small>{String(index + 1).padStart(2, "0")} / {meta}</small><strong>{title}</strong><span>{description}</span></span>
            </button>
          ))}
          <div className="kh-gallery-rail__spacer" aria-hidden="true" />
        </div>

        <div className="kh-cp-shell"><p className="kh-gallery-archive__note">We keep in touch with graduates after the classroom and celebrate the work their learning sets in motion.</p></div>
      </section>

      <section className="kh-cp-cta"><div className="kh-cp-shell kh-cp-cta__inner"><div><h2>Bring your next chapter into focus.</h2><a className="kh-cp-link" href="mailto:pg@thecoachingnations.com">Share your story <span aria-hidden="true">↗</span></a></div><p>Follow Kingshill&apos;s community as we keep raising builders and reformers across Nigeria.</p></div></section>

      {focused !== null && (
        <div className="kh-gallery-lightbox" role="dialog" aria-modal="true" aria-label={gallery[focused][0]} onClick={() => setFocused(null)}>
          <button type="button" className="kh-gallery-lightbox__close" onClick={() => setFocused(null)}>Close <span aria-hidden="true">×</span></button>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={gallery[focused][2]} alt={gallery[focused][1]} />
            <figcaption><span>{String(focused + 1).padStart(2, "0")} / {gallery[focused][3]}</span><strong>{gallery[focused][0]}</strong><p>{gallery[focused][1]}</p></figcaption>
          </figure>
        </div>
      )}
    </CorporatePageFrame>
  );
};

export default Gallery;
