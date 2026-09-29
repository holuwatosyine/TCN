import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import LogoImage from "@/assets/kingshill-logo-official.webp";

const Footer = () => (
  <footer className="kh-footer" data-world-stage="summit">
    <div className="kh-shell kh-footer__shell">
      <div className="kh-footer__lead">
        <div>
          <span className="kh-label">Kingshill School of Discovery</span>
          <h2>Build with<br /><em>purpose.</em></h2>
        </div>
        <p>At Kingshill, we unlock potential and raise builders and reformers through coaching education and practical development.</p>
      </div>
      <div className="kh-footer__stage">
        <div className="kh-footer__glass" data-brand-glass>
          <div className="kh-footer__column">
            <span className="kh-label">Our programmes</span>
            <Link to="/training">Life Coaching Certification</Link>
            <Link to="/training">NLP Training Program</Link>
            <Link to="/training">Corporate Coaching Program</Link>
            <Link to="/training">Transitional Youth Coaching Program</Link>
          </div>
          <div className="kh-footer__column">
            <span className="kh-label">Contact us</span>
            <address>14 Adedotun Dina Street<br />Mende–Maryland, Lagos</address>
            <a href="tel:+2349090550072">+234 909 055 0072</a>
            <a href="tel:+2349090550073">+234 909 055 0073</a>
            <a href="mailto:pg@thecoachingnations.com">pg@thecoachingnations.com</a>
          </div>
          <div className="kh-footer__column">
            <span className="kh-label">Follow Kingshill</span>
            <a href="https://facebook.com/kingshillcoaching" target="_blank" rel="noreferrer">Facebook <ArrowUpRight aria-hidden="true" /></a>
            <a href="https://instagram.com/kingshillcoaching" target="_blank" rel="noreferrer">Instagram <ArrowUpRight aria-hidden="true" /></a>
            <a href="https://linkedin.com/company/kingshillcoaching" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <i className="kh-footer__line kh-footer__line--one" aria-hidden="true" />
          <i className="kh-footer__line kh-footer__line--two" aria-hidden="true" />
        </div>
      </div>
      <div className="kh-footer__bottom">
        <Link to="/" className="kh-footer__brand" aria-label="Kingshill School of Discovery home"><img src={LogoImage} alt="" /><span><strong>Kingshill</strong><small>School of Discovery</small></span></Link>
        <span>Nigeria&apos;s first registered coaching academy</span>
        <span>CCC accredited</span>
        <span>Lagos · Since 1999</span>
        <span>Life transformation &amp; social development</span>
      </div>
    </div>
  </footer>
);

export default Footer;
