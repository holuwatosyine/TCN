import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import EditorialHeading from "@/components/EditorialHeading";
import LiquidButton from "@/components/effects/LiquidButton";
import InteractiveImage from "@/components/effects/InteractiveImage";
import HeroPressureHeading from "@/components/HeroPressureHeading";
import { focusAreas, programmes, testimonials } from "@/content/site";
import "@/components/HomeExperience.css";
import "@/experience/AscentExperience.css";

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
        .from(".kh-home__intro, .kh-home__hero-actions, .kh-home__stats, .kh-home__terrain-meta", { y: 22, autoAlpha: 0, duration: .72, stagger: .07 }, "-=.58");

      gsap.utils.toArray<HTMLElement>("[data-home-reveal]").forEach((item) => {
        gsap.fromTo(item, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .9, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 86%", once: true } });
      });

      gsap.utils.toArray<HTMLElement>(".kh-home__section-title").forEach((heading) => {
        gsap.fromTo(heading, { yPercent: 12 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: heading, start: "top bottom", end: "top 45%", scrub: .8 } });
      });

      gsap.fromTo(".kh-home__about-media img",
        { clipPath: "inset(12% 7% 18% 7%)", scale: 1.055 },
        { clipPath: "inset(0% 0% 0% 0%)", scale: 1, ease: "none", scrollTrigger: { trigger: ".kh-home__about-media", start: "top 94%", end: "center 56%", scrub: .85 } },
      );
    }, root);
    return () => context.revert();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("kingshill:programme-change", { detail: { index: activeProgramme } }));
  }, [activeProgramme]);

  const nextTestimonial = (direction: number) => setActiveTestimonial((index) => (index + direction + testimonials.length) % testimonials.length);

  return (
    <div ref={rootRef} className="kh-home">
      <Navigation />
      <main>
        <section className="kh-home__hero" aria-labelledby="home-title" data-world-stage="night">
          <div className="kh-shell kh-home__hero-grid">
            <div className="kh-home__eyebrow"><span>01</span><p>Nigeria&apos;s first registered coaching academy</p></div>
            <HeroPressureHeading id="home-title" className="kh-home__title" lines={["Discover", "purpose.", "Discover", "life."]} />
            <div className="kh-home__intro">
              <p>At Kingshill, we unlock potential. We raise builders and reformers.</p>
              <div className="kh-home__hero-actions">
                <LiquidButton className="kh-home__button" to="/training" ariaLabel="Explore Kingshill training programmes">Explore programmes <span aria-hidden="true">↗</span></LiquidButton>
                <a className="kh-home__text-link" href="#about">Meet Kingshill <ArrowDown aria-hidden="true" /></a>
              </div>
            </div>
            <div className="kh-home__stats" aria-label="Kingshill facts"><div><strong>25+</strong><span>Years</span></div><div><strong>1,000+</strong><span>Graduates</span></div><div><strong>CCC</strong><span>Accredited</span></div></div>
            <div className="kh-home__hero-note"><span>Life transformation</span><span>Social development</span></div>
            <div className="kh-home__terrain-meta" aria-hidden="true"><span>The ascent / 01</span><span>Lagos · Est. 1999</span></div>
          </div>
        </section>

        <section id="about" className="kh-home__section kh-home__about" data-world-stage="discovery">
          <div className="kh-shell">
            <div className="kh-home__section-head" data-home-reveal><div className="kh-home__section-label"><span>02</span><span>About Kingshill</span></div><EditorialHeading className="kh-home__section-title">Potential is a practice.</EditorialHeading></div>
            <div className="kh-home__about-grid">
              <InteractiveImage
                className="kh-home__about-media"
                imageClassName="kh-home__about-image"
                src={aboutImage}
                alt="Kingshill facilitators gathered for a professional development session"
              >
                <span className="kh-home__about-contours" aria-hidden="true"><i /><i /><i /></span>
                <figcaption><span>02 / Discovery</span><span>We make you see the future and secure it.</span></figcaption>
              </InteractiveImage>
              <div className="kh-home__about-copy" data-home-reveal><EditorialHeading as="h3" material="serif">Unlock potential.<br />Raise builders.</EditorialHeading><p>At Kingshill Coaching Academy, we believe in the power of human potential. Founded as Nigeria&apos;s first registered coaching academy, we have been pioneering excellence in coaching education for over two decades.</p><Link className="kh-home__text-link kh-home__text-link--dark" to="/about">Read our story <ArrowUpRight aria-hidden="true" /></Link></div>
            </div>
            <div className="kh-home__pillars" data-home-reveal>{focusAreas.map(([title, copy], index) => <div key={title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
          </div>
        </section>

        <section id="programmes" className="kh-home__section kh-home__programmes" data-world-stage="routes">
          <div className="kh-shell">
            <div className="kh-home__section-head" data-home-reveal><div className="kh-home__section-label"><span>03</span><span>Training programmes</span></div><EditorialHeading className="kh-home__section-title">A practice for every direction.</EditorialHeading></div>
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
                <svg className="kh-home__programme-map" viewBox="0 0 520 420" preserveAspectRatio="none" aria-hidden="true">
                  {[0, 1, 2, 3].map((index) => (
                    <path
                      key={index}
                      className={activeProgramme === index ? "is-active" : ""}
                      d={[
                        "M-20 350 C90 290 135 320 205 245 C280 168 360 185 548 72",
                        "M-24 310 C84 246 150 286 224 218 C305 142 390 165 548 108",
                        "M-15 372 C98 334 176 346 250 278 C336 199 404 215 552 154",
                        "M-20 270 C95 228 178 244 255 190 C344 127 415 133 552 48",
                      ][index]}
                    />
                  ))}
                  <circle cx="438" cy={activeProgramme === 0 ? 126 : activeProgramme === 1 ? 156 : activeProgramme === 2 ? 214 : 99} r="5" />
                </svg>
                <div className="kh-home__programme-stage-mark"><span>Selected trajectory</span><strong>{String(activeProgramme + 1).padStart(2, "0")}</strong><i aria-hidden="true" /></div>
                <div className="kh-home__programme-stage-copy"><span>{programmes[activeProgramme].meta}</span><h3>{programmes[activeProgramme].title}</h3></div>
                <div className="kh-home__programme-elevation" aria-hidden="true"><span /><span /><span /><span /><span /></div>
                <div className="kh-home__programme-stage-foot"><span>Life transformation</span><span>CCC accredited pathway</span></div>
              </aside>
            </div>
          </div>
        </section>

        <section id="voices" className="kh-home__section kh-home__voices" data-world-stage="dawn">
          <div className="kh-shell">
            <div className="kh-home__section-head" data-home-reveal><div className="kh-home__section-label"><span>04</span><span>Graduate voices</span></div><EditorialHeading className="kh-home__section-title">The work goes with you.</EditorialHeading></div>
            <div className="kh-home__quote-stage" data-home-reveal>
              <div className="kh-home__quote-aside"><span>What changes</span><strong>{String(activeTestimonial + 1).padStart(2, "0")}</strong><span>/ {String(testimonials.length).padStart(2, "0")}</span><p>Coaching education that travels beyond the classroom.</p></div>
              <div className="kh-home__quote-content" id={`voice-panel-${activeTestimonial}`} role="tabpanel" aria-labelledby={`voice-tab-${activeTestimonial}`} key={activeTestimonial}><span className="kh-home__quote-index">Selected voice</span><blockquote>“{testimonials[activeTestimonial].quote}”</blockquote><footer><strong>{testimonials[activeTestimonial].name}</strong><span>{testimonials[activeTestimonial].role}</span></footer></div>
              <div className="kh-home__quote-controls"><button type="button" onClick={() => nextTestimonial(-1)} aria-label="Previous graduate voice"><ArrowLeft aria-hidden="true" /></button><button type="button" onClick={() => nextTestimonial(1)} aria-label="Next graduate voice"><ArrowRight aria-hidden="true" /></button></div>
              <div className="kh-home__quote-nav" role="tablist" aria-label="Graduate voices">{testimonials.map((testimonial, index) => <button id={`voice-tab-${index}`} type="button" role="tab" aria-selected={activeTestimonial === index} aria-controls={`voice-panel-${index}`} tabIndex={activeTestimonial === index ? 0 : -1} aria-label={`Show ${testimonial.name}'s testimonial`} className={activeTestimonial === index ? "is-active" : ""} key={testimonial.name} onClick={() => setActiveTestimonial(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{testimonial.name}</strong><small>{testimonial.role}</small></button>)}</div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomeExperience;
