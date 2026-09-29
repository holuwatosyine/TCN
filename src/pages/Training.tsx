import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CorporatePageFrame from "@/components/CorporatePageFrame";
import "@/experience/AscentExperience.css";

const programmes = [
  { title: "Life Coaching Certification", description: "Our flagship CCC-accredited programme with 20+ coaching designations that transforms lives and careers.", features: ["CCC accredited", "20+ designations"] },
  { title: "Transitional Youth Coaching Program", description: "Specialised training for coaching young professionals and students.", features: ["Youth focused", "3 months"] },
  { title: "Youth Entrepreneurship Program (YEP)", description: "Empowering young entrepreneurs with business coaching and mentorship.", features: ["Business coaching", "4 months"] },
  { title: "Ministry Coaching Program (MCP)", description: "Specialised coaching for religious and ministry leaders.", features: ["Ministry focus", "5 months"] },
];

const designations = ["Personal Coaching", "Relationship & Marital Coaching", "Business & Strategy Coaching", "Investment & Finance Coaching", "Spiritual Intelligence Coaching", "Ministry Coaching", "Teenage Coaching", "Youth Development Coaching", "Sex and Sexuality Coaching", "Mindshift Coaching", "Transformational Coaching", "Corporate & Executive Coaching", "Mental Health Coaching", "Lifestyle Health Coaching", "Communication Coaching", "Sales Coaching", "Peak Performance Coaching", "Leadership Coaching", "Management Coaching", "Human Design Systems Coaching"];

const paths = [
  "M12 354 C100 310 146 318 208 258 C284 185 347 200 510 82",
  "M12 318 C90 259 156 286 224 228 C302 162 390 168 510 116",
  "M12 378 C95 350 170 348 250 286 C334 221 407 226 510 172",
  "M12 276 C95 238 168 246 252 196 C343 142 418 142 510 58",
];

const Training = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("kingshill:programme-change", { detail: { index: active } }));
  }, [active]);

  return (
    <CorporatePageFrame pageNumber="03" eyebrow="Training programmes" title={<>Learn to move <em>people forward.</em></>} intro="In addition to our life coaching core certification, we offer a range of specialist programmes with 20+ coaching designations you can study alongside or on their own.">
      <section className="kh-cp-section kh-cp-section--paper kh-training-routes">
        <div className="kh-cp-shell">
          <div className="kh-cp-section__head kh-cp-reveal"><div className="kh-cp-section__label"><span>01</span><span>Choose your path</span></div><div><h2>Training with range.</h2><p>Build a practice around the people and problems you care about most.</p></div></div>
          <div className="kh-training-routes__grid">
            <div className="kh-training-routes__list" role="tablist" aria-label="Kingshill training pathways">
              {programmes.map((program, index) => (
                <button
                  id={`training-route-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={active === index}
                  aria-controls="training-route-panel"
                  className={active === index ? "is-active" : ""}
                  key={program.title}
                  onClick={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                >
                  <span className="kh-training-routes__number">{String(index + 1).padStart(2, "0")}</span>
                  <span><strong>{program.title}</strong><small>{program.features.join(" · ")}</small></span>
                  <i aria-hidden="true">↗</i>
                </button>
              ))}
            </div>

            <aside id="training-route-panel" role="tabpanel" aria-labelledby={`training-route-${active}`} className="kh-training-map kh-cp-reveal" data-brand-glass>
              <svg viewBox="0 0 520 420" preserveAspectRatio="none" aria-hidden="true">
                {paths.map((path, index) => <path key={path} d={path} className={active === index ? "is-active" : ""} />)}
                <g className="kh-training-map__contours">
                  <ellipse cx="358" cy="172" rx="118" ry="64" />
                  <ellipse cx="358" cy="172" rx="88" ry="46" />
                  <ellipse cx="358" cy="172" rx="55" ry="28" />
                </g>
                <circle className="kh-training-map__pin" cx="430" cy={[126, 160, 218, 96][active]} r="6" />
              </svg>
              <div className="kh-training-map__top"><span>Selected trajectory</span><strong>{String(active + 1).padStart(2, "0")}</strong></div>
              <div className="kh-training-map__copy"><span>{programmes[active].features.join(" / ")}</span><h3>{programmes[active].title}</h3><p>{programmes[active].description}</p><Link to={`/contact?programme=${encodeURIComponent(programmes[active].title)}`}>Explore pathway <span aria-hidden="true">↗</span></Link></div>
              <div className="kh-training-map__profile" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
            </aside>
          </div>
        </div>
      </section>

      <section className="kh-cp-section kh-cp-section--ink kh-training-waypoints">
        <div className="kh-cp-shell">
          <div className="kh-cp-section__head kh-cp-reveal"><div className="kh-cp-section__label"><span>02</span><span>20+ specialisations</span></div><div><h2>Find the work that fits you.</h2><p>Our Life Coaching Certification programme lets you focus your learning and serve specific client needs.</p></div></div>
          <div className="kh-training-waypoints__grid">{designations.map((designation, index) => <span className="kh-cp-reveal" key={designation}><strong>{String(index + 1).padStart(2, "0")}</strong><i aria-hidden="true" />{designation}</span>)}</div>
        </div>
      </section>

      <section className="kh-cp-section kh-cp-section--teal"><div className="kh-cp-shell kh-cp-split"><div className="kh-cp-copy kh-cp-reveal"><p>Study with people who understand the work.</p><p>Our approach is practical, focused, and designed to turn knowledge into confident action — in your own life, in your clients&apos; lives, and in organisations.</p></div><aside className="kh-cp-aside kh-cp-reveal"><div className="kh-cp-aside__row"><span>01</span><div><strong>CCC accredited</strong><p>Professional recognition for your learning journey.</p></div></div><div className="kh-cp-aside__row"><span>02</span><div><strong>Mentorship built in</strong><p>Guidance that continues beyond the classroom.</p></div></div><div className="kh-cp-aside__row"><span>03</span><div><strong>Practical training</strong><p>Tools you can use from your first session.</p></div></div></aside></div></section>
      <section className="kh-cp-cta"><div className="kh-cp-shell kh-cp-cta__inner"><div><h2>Your next chapter starts here.</h2><Link className="kh-cp-link" to="/contact">Ask about enrolment <span aria-hidden="true">↗</span></Link></div><p>Contact the Kingshill team for programme dates, fees, and the right path for your goals.</p></div></section>
    </CorporatePageFrame>
  );
};

export default Training;
