import { useState } from "react";
import CorporatePageFrame from "@/components/CorporatePageFrame";
import "@/experience/AscentExperience.css";

const locations = [
  ["Lagos", "No #14 Adedotun Dina Street, Mende - Maryland", "09090550072", "Head office"],
  ["Abuja", "Suite 45, Central Business District", "09090550073", "Regional office"],
  ["Port Harcourt", "15 Trans Amadi Industrial Layout", "09090550074", "Regional office"],
];

const Contact = () => {
  const [sent, setSent] = useState(false);
  return (
    <CorporatePageFrame pageNumber="07" eyebrow="Contact Kingshill" title={<>Let&apos;s make a <em>start.</em></>} intro="Tell us what you are working towards and we will help you find the right programme, conversation, or next step." actionLabel="Call the academy" actionHref="tel:+2349090550072">
      <section className="kh-cp-section kh-cp-section--paper kh-contact-start">
        <div className="kh-cp-shell">
          <div className="kh-cp-section__head kh-cp-reveal"><div className="kh-cp-section__label"><span>01</span><span>Start here</span></div><div><h2>A direct line to the right room.</h2><p>Whether you are exploring a certification, planning corporate training, or looking for a resource, send us a note.</p></div></div>
          <div className="kh-cp-split">
            <div className="kh-cp-copy kh-cp-reveal"><p>Good work often starts with a clear conversation.</p><p>Our team is available Monday to Friday, 9:00 AM – 6:00 PM. We look forward to hearing what you are building.</p><div className="kh-cp-aside"><div className="kh-cp-aside__row"><span>Visit</span><div><strong>14 Adedotun Dina Street</strong><p>Mende – Maryland, Lagos</p></div></div><div className="kh-cp-aside__row"><span>Talk</span><div><strong><a href="tel:+2349090550072">+234 909 055 0072</a></strong><p><a href="tel:+2349090550073">+234 909 055 0073</a></p></div></div><div className="kh-cp-aside__row"><span>Write</span><div><strong><a href="mailto:pg@thecoachingnations.com">pg@thecoachingnations.com</a></strong><p>We usually respond within one working day.</p></div></div></div></div>
            <form className="kh-cp-form kh-cp-reveal" action="mailto:pg@thecoachingnations.com" method="post" encType="text/plain" onSubmit={() => setSent(true)}><label>Name<input name="name" type="text" placeholder="Your name" required /></label><label>Email<input name="email" type="email" placeholder="you@example.com" required /></label><label>How can we help?<textarea name="message" placeholder="Tell us a little about what you need" required /></label><button type="submit">{sent ? "Message ready" : "Send your message"} ↗</button></form>
          </div>
        </div>
      </section>

      <section className="kh-cp-section kh-cp-section--ink kh-contact-network">
        <div className="kh-cp-shell">
          <div className="kh-cp-section__head kh-cp-reveal"><div className="kh-cp-section__label"><span>02</span><span>Find us</span></div><div><h2>Across the country. Close to the work.</h2><p>Our learning community reaches people and organisations across Nigeria.</p></div></div>
          <div className="kh-contact-network__visual kh-cp-reveal" data-brand-glass>
            <svg viewBox="0 0 900 430" preserveAspectRatio="none" aria-hidden="true">
              <path className="kh-contact-network__coast" d="M-20 252 C112 226 174 277 292 242 C389 213 446 252 535 219 C638 181 737 196 930 134" />
              <path className="kh-contact-network__lagoon" d="M-12 302 C116 273 193 324 310 285 C420 248 482 292 590 248 C700 202 781 226 930 182" />
              <path className="kh-contact-network__route" d="M158 314 C245 252 332 284 416 224 C503 162 602 178 718 118" />
              <g className="kh-contact-network__rings"><ellipse cx="285" cy="255" rx="112" ry="58" /><ellipse cx="285" cy="255" rx="79" ry="39" /><ellipse cx="285" cy="255" rx="46" ry="22" /></g>
              <circle className="kh-contact-network__pin" cx="285" cy="255" r="7" />
            </svg>
            <div className="kh-contact-network__visual-meta"><span>Primary signal</span><strong>Mende–Maryland</strong><small>Lagos / Head office</small></div>
            <div className="kh-contact-network__visual-note"><span>14 Adedotun Dina Street</span><span>Mon–Fri / 09:00–18:00</span></div>
          </div>
          <div className="kh-contact-network__locations">{locations.map(([city, address, phone, type], index) => <article className="kh-contact-location kh-cp-reveal" key={city}><span>{String(index + 1).padStart(2, "0")} / {type}</span><h3>{city}</h3><p>{address}</p><a href={`tel:+234${phone.slice(-10)}`}>{phone} <b aria-hidden="true">↗</b></a></article>)}</div>
        </div>
      </section>

      <section className="kh-cp-cta"><div className="kh-cp-shell kh-cp-cta__inner"><div><h2>Questions are part of the process.</h2><a className="kh-cp-link" href="mailto:pg@thecoachingnations.com">Email the academy <span aria-hidden="true">↗</span></a></div><p>Ask about programme dates, fees, accreditation, or which path best fits your goals.</p></div></section>
    </CorporatePageFrame>
  );
};

export default Contact;
