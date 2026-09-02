import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EditorialHeading from "@/components/EditorialHeading";
import LiquidButton from "@/components/effects/LiquidButton";
import HeroMaterialField from "@/components/HeroMaterialField";
import HeroPressureHeading from "@/components/HeroPressureHeading";
import { focusAreas, programmes, testimonials } from "@/content/site";
import "@/components/HomeExperience.css";

gsap.registerPlugin(ScrollTrigger);
const aboutImage = "/IMG-20250827-WA0019.webp";

const HomeExperience = () => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeProgramme, setActiveProgramme] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".kh-home__eyebrow", { y: 18, autoAlpha: 0, duration: .7 })
        .from(".kh-hero-pressure__line", { yPercent: 105, clipPath: "inset(0 0 100% 0)", autoAlpha: 0, duration: 1.05, stagger: .1 }, "-=.35")
        .from(".kh-home__intro, .kh-home__hero-actions, .kh-home__stats", { y: 22, autoAlpha: 0, duration: .72, stagger: .08 }, "-=.58")
        .from(".kh-home__hero", { scale: .985, autoAlpha: 0, duration: 1.1 }, "-=1");
      gsap.utils.toArray<HTMLElement>("[data-home-reveal]").forEach((item) => {
        gsap.fromTo(item, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".kh-home__section-title").forEach((heading) => {
        gsap.fromTo(heading, { yPercent: 12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: heading, start: "top bottom", end: "top 45%", scrub: .8 } });
      });
    }, root);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches) return;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;
    const draw = () => {
      currentX += (targetX - currentX) * .12;
      currentY += (targetY - currentY) * .12;
      root.style.setProperty("--home-pointer-x", String(currentX));
      root.style.setProperty("--home-pointer-y", String(currentY));
      if (Math.abs(targetX - currentX) > .002 || Math.abs(targetY - currentY) > .002) frame = requestAnimationFrame(draw);
      else frame = 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onPointerLeave = () => { targetX = 0; targetY = 0; if (!frame) frame = requestAnimationFrame(draw); };
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerleave", onPointerLeave, { passive: true });
    return () => { cancelAnimationFrame(frame); root.removeEventListener("pointermove", onPointerMove); root.removeEventListener("pointerleave", onPointerLeave); };
  }, []);

  const nextTestimonial = (direction: number) => setActiveTestimonial((index) => (index + direction + testimonials.length) % testimonials.length);

  return (
    <div ref={rootRef} className="kh-home">
      <Navigation />
      <main>
        <section className="kh-home__hero" aria-labelledby="home-title">
          <div className="kh-shell kh-home__hero-grid">
            <div className="kh-home__eyebrow"><span>01</span><p>Nigeria&apos;s first registered coaching academy</p></div>
            <HeroPressureHeading className="kh-home__title" lines={["Discover", "purpose.", "Discover", "life."]} />
            <div className="kh-home__intro"><p>At Kingshill, we unlock potential. We raise builders and reformers.</p><div className="kh-home__hero-actions"><LiquidButton className="kh-home__button" to="/training" ariaLabel="Explore Kingshill training programmes">Explore programmes <span aria-hidden="true">↗</span></LiquidButton><a className="kh-home__text-link" href="#about">Meet Kingshill <ArrowDown aria-hidden="true" /></a></div></div>
            <div className="kh-home__stats" aria-label="Kingshill facts"><div><strong>25+</strong><span>Years</span></div><div><strong>1,000+</strong><span>Graduates</span></div><div><strong>CCC</strong><span>Accredited</span></div></div>
            <div className="kh-home__hero-note"><span>Life transformation</span><span>Social development</span></div>
          </div>
          <div className="kh-home__hero-material" aria-hidden="true"><HeroMaterialField /><span className="kh-home__hero-material-mark">KH / 01</span></div>
        </section>

        <section id="about" className="kh-home__section kh-home__about">
          <div className="kh-shell">
            <div className="kh-home__section-head" data-home-reveal><div className="kh-home__section-label"><span>02</span><span>About Kingshill</span></div><EditorialHeading className="kh-home__section-title">Potential is a practice.</EditorialHeading></div>
            <div className="kh-home__about-grid">
              <figure className="kh-home__about-media" data-home-reveal><img src={aboutImage} alt="Kingshill facilitators gathered for a professional development session" loading="lazy" /><figcaption>We make you see the future and secure it.</figcaption></figure>
              <div className="kh-home__about-copy" data-home-reveal><EditorialHeading as="h3" material="serif">Unlock potential.<br />Raise builders.</EditorialHeading><p>At Kingshill Coaching Academy, we believe in the power of human potential. Founded as Nigeria&apos;s first registered coaching academy, we have been pioneering excellence in coaching education for over two decades.</p><Link className="kh-home__text-link kh-home__text-link--dark" to="/about">Read our story <ArrowUpRight aria-hidden="true" /></Link></div>
            </div>
            <div className="kh-home__pillars" data-home-reveal>{focusAreas.map(([title, copy], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
          </div>
        </section>

        <section id="programmes" className="kh-home__section kh-home__programmes">
          <div className="kh-shell"><div className="kh-home__section-head" data-home-reveal><div className="kh-home__section-label"><span>03</span><span>Training programmes</span></div><EditorialHeading className="kh-home__section-title">A practice for every direction.</EditorialHeading></div>
            <div className="kh-home__programmes-grid">
              <div className="kh-home__programme-list" data-home-reveal>
                {programmes.map((programme, index) => (
                  <article className={`kh-home__programme ${activeProgramme === index ? "is-active" : ""}`} key={programme.title} onMouseEnter={() => setActiveProgramme(index)}>
                    <button type="button" onClick={() => setActiveProgramme(index)} onFocus={() => setActiveProgramme(index)} aria-expanded={activeProgramme === index}>
                      <span className="kh-home__programme-number">{String(index + 1).padStart(2, "0")}</span>
                      <span className="kh-home__programme-content"><strong>{programme.title}</strong><span>{programme.copy}</span></span>
                      <span className="kh-home__programme-meta">{programme.meta}</span>
                      <span className="kh-home__programme-arrow" aria-hidden="true">↗</span>
                    </button>
                    <div className="kh-home__programme-detail"><span>Route {String(index + 1).padStart(2, "0")}</span><p>{programme.meta} pathway for people ready to turn insight into practice.</p><Link to={programme.href} aria-label={`Explore ${programme.title}`}>Explore programme <span aria-hidden="true">↗</span></Link></div>
                  </article>
                ))}
              </div>
              <aside className="kh-home__programme-stage" data-home-reveal aria-live="polite">
                <div className="kh-home__programme-stage-mark"><span>Selected route</span><strong>{String(activeProgramme + 1).padStart(2, "0")}</strong><i aria-hidden="true" /></div>
                <div className="kh-home__programme-stage-copy"><span>{programmes[activeProgramme].meta}</span><h3>{programmes[activeProgramme].title}</h3></div>
                <div className="kh-home__programme-stage-foot"><span>Life transformation</span><span>CCC accredited pathway</span></div>
              </aside>
            </div>
          </div>
        </section>

        <section id="voices" className="kh-home__section kh-home__voices">
          <div className="kh-shell">
            <div className="kh-home__section-head" data-home-reveal><div className="kh-home__section-label"><span>04</span><span>Graduate voices</span></div><EditorialHeading className="kh-home__section-title">The work goes with you.</EditorialHeading></div>
            <div className="kh-home__quote-stage" data-home-reveal>
              <div className="kh-home__quote-aside"><span>What changes</span><strong>{String(activeTestimonial + 1).padStart(2, "0")}</strong><span>/ {String(testimonials.length).padStart(2, "0")}</span><p>Coaching education that travels beyond the classroom.</p></div>
              <div className="kh-home__quote-content" key={activeTestimonial}><span className="kh-home__quote-index">Selected voice</span><blockquote>“{testimonials[activeTestimonial].quote}”</blockquote><footer><strong>{testimonials[activeTestimonial].name}</strong><span>{testimonials[activeTestimonial].role}</span></footer></div>
              <div className="kh-home__quote-controls"><button type="button" onClick={() => nextTestimonial(-1)} aria-label="Previous graduate voice"><ArrowLeft aria-hidden="true" /></button><button type="button" onClick={() => nextTestimonial(1)} aria-label="Next graduate voice"><ArrowRight aria-hidden="true" /></button></div>
              <div className="kh-home__quote-nav" role="tablist" aria-label="Graduate voices">{testimonials.map((testimonial, index) => <button type="button" role="tab" aria-selected={activeTestimonial === index} aria-label={`Show ${testimonial.name}'s testimonial`} className={activeTestimonial === index ? "is-active" : ""} key={testimonial.name} onClick={() => setActiveTestimonial(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></button>)}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomeExperience;
