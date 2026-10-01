import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import InteractiveImage from "@/components/effects/InteractiveImage";
import "@/components/CorporatePage.css";
import "@/experience/AscentExperience.css";

type CorporatePageFrameProps = {
  eyebrow: string;
  title: ReactNode;
  intro: string;
  pageNumber: string;
  children: ReactNode;
  heroImage?: string;
  heroAlt?: string;
  heroCaption?: string;
  actionLabel?: string;
  actionHref?: string;
};

const PLATES: Record<string, { title: string; rows: [string, string][] }> = {
  "03": { title: "Terrace survey", rows: [["Routes", "04"], ["Waypoints", "20+"], ["Accreditation", "CCC"]] },
  "04": { title: "The ridge line", rows: [["Guides", "03"], ["Experience", "12–20+ yrs"], ["Certified", "ICF / CCC"]] },
  "05": { title: "Field archive", rows: [["Guides", "Free"], ["Videos", "3 series"], ["Templates", "35+"]] },
  "06": { title: "Field record", rows: [["Plates", "06"], ["Film", "1 / 5:30"], ["Cities", "05"]] },
  "07": { title: "Signal", rows: [["Position", "6.5°N 3.4°E"], ["Office", "Mende–Maryland"], ["Hours", "Mon–Fri 9–6"]] },
};

const CorporatePageFrame = ({
  eyebrow,
  title,
  intro,
  pageNumber,
  children,
  heroImage,
  heroAlt,
  heroCaption,
  actionLabel = "Start a conversation",
  actionHref = "/contact",
}: CorporatePageFrameProps) => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const signalMode = ({ "03": "terrace", "04": "portrait", "05": "archive", "06": "cinema", "07": "location" } as Record<string, string>)[pageNumber] ?? "ridge";

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    gsap.registerPlugin(ScrollTrigger);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(page.querySelectorAll<HTMLElement>(".kh-cp-reveal"));
    if (reducedMotion) {
      revealItems.forEach((item) => item.classList.add("is-inview"));
      return;
    }

    const context = gsap.context(() => {
      const introTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      introTimeline
        .from(".kh-cp-hero__eyebrow", { y: 18, autoAlpha: 0, duration: .65 })
        .from(".kh-cp-hero__copy h1", { yPercent: 18, autoAlpha: 0, duration: 1.15 }, "-=.32")
        .from(".kh-cp-hero__copy > p, .kh-cp-hero__copy .kh-cp-link", { y: 18, autoAlpha: 0, duration: .7, stagger: .08 }, "-=.55")
        .from(".kh-cp-hero__image, .kh-cp-hero__signal", { scale: .94, autoAlpha: 0, duration: 1.1 }, "-=.8")
        .from(".kh-cp-hero__foot", { y: 12, autoAlpha: 0, duration: .55 }, "-=.5");

      revealItems.forEach((item) => {
        gsap.fromTo(item, { y: 26, autoAlpha: 0 }, {
          y: 0,
          autoAlpha: 1,
          duration: .85,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".kh-cp-section__head h2").forEach((heading) => {
        gsap.fromTo(heading, { yPercent: 8 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: heading, start: "top bottom", end: "top 48%", scrub: .7 } });
      });
    }, page);

    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className="kh-corporate-page" id="main-content" data-page-number={pageNumber}>
      <Navigation />
      <main>
        <section className="kh-cp-hero kh-route-section" aria-labelledby="route-title" data-world-stage="route">
          <div className="kh-cp-shell kh-cp-hero__grid">
            <div className="kh-cp-hero__eyebrow kh-cp-reveal">
              <span>{pageNumber}</span>
              <p>{eyebrow}</p>
            </div>

            <div className="kh-cp-hero__copy kh-cp-reveal">
              <h1 id="route-title">{title}</h1>
              <p>{intro}</p>
              <Link className="kh-cp-link kh-cp-link--light" to={actionHref}>
                {actionLabel} <ArrowUpRight aria-hidden="true" />
              </Link>
            </div>

            {heroImage ? (
              <InteractiveImage
                className="kh-cp-hero__image kh-cp-reveal kh-route-image"
                src={heroImage}
                alt={heroAlt ?? "Kingshill School of Discovery"}
              >
                <figcaption>{heroCaption ?? "Kingshill School of Discovery · Lagos"}</figcaption>
              </InteractiveImage>
            ) : (
              <div className="kh-cp-hero__signal kh-cp-plate" aria-hidden="true">
                <span className="kh-cp-plate__title">{(PLATES[pageNumber] ?? PLATES["03"]).title}</span>
                <span className="kh-cp-plate__rule" />
                <dl>
                  {(PLATES[pageNumber] ?? PLATES["03"]).rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                </dl>
                <span className="kh-cp-plate__corner kh-cp-plate__corner--a" />
                <span className="kh-cp-plate__corner kh-cp-plate__corner--b" />
              </div>
            )}

            <div className="kh-cp-hero__foot">
              <span>School of Discovery</span>
              <span>Life transformation &amp; social development</span>
              <a href="#route-content" aria-label="Scroll to page content"><ArrowDown aria-hidden="true" /></a>
            </div>
          </div>
        </section>
        <div id="route-content">{children}</div>
      </main>
      <Footer />
    </div>
  );
};

export default CorporatePageFrame;
