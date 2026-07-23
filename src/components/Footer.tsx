import Link from "next/link";
import { EMAIL, OWNER, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

const BRANDS = [
  { src: "/brand-daikin.png", alt: "Daikin" },
  { src: "/brand-mitsubishi-electric.png", alt: "Mitsubishi Electric" },
  { src: "/brand-fujitsu.png", alt: "Fujitsu" },
  { src: "/brand-lg.png", alt: "LG" },
  { src: "/brand-samsung.png", alt: "Samsung" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/coolmaster-wordmark.png"
              alt="CoolMaster Services Limited"
              width={680}
              height={173}
              loading="lazy"
            />
            <p>
              Refrigeration, air conditioning &amp; HVAC specialists keeping New Zealand
              homes and businesses at the perfect temperature.
            </p>
          </div>
          <div>
            <h5>Services</h5>
            <ul>
              <li><Link href="/services/commercial-hvac">Commercial HVAC</Link></li>
              <li><Link href="/services/commercial-refrigeration">Commercial refrigeration</Link></li>
              <li><Link href="/services/bwof-form-12a">BWoF &amp; Form 12A support</Link></li>
              <li><Link href="/services/heat-pumps">Heat pumps</Link></li>
              <li><Link href="/services/servicing-maintenance">Servicing &amp; maintenance</Link></li>
              <li><Link href="/services">All services</Link></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/services#audiences">Residential &amp; commercial</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h5>Contact</h5>
            <ul>
              <li>{OWNER}</li>
              <li><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></li>
              <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
              <li>[Your service area], NZ</li>
              <li>Mon–Fri 7:30am–5pm</li>
            </ul>
          </div>
        </div>
        <div className="footer-brands">
          <h5>Heat pump &amp; air conditioning brands we install &amp; maintain</h5>
          <ul className="brand-list">
            {BRANDS.map((b) => (
              <li key={b.alt}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.src} alt={b.alt} loading="lazy" />
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-bottom">
          <div>© <span>{year}</span> CoolMaster Services Limited · GST registered</div>
          <div className="socials">
            <a href="#" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
