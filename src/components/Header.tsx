"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SERVICE_MENU, WA_URL, PHONE_DISPLAY, PHONE_TEL } from "@/lib/site";

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const cls = (href: string) => (active(href) ? "active" : undefined);
  const cur = (href: string) => (active(href) ? ("page" as const) : undefined);
  const servicesActive = pathname.startsWith("/services");

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`} id="top">
        <div className="wrap header-inner">
          <Link href="/" className="brand" aria-label="CoolMaster Services home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/coolmaster-wordmark.png"
              alt="CoolMaster Services Limited — Refrigeration, Air Conditioning & HVAC"
              width={680}
              height={173}
              fetchPriority="high"
            />
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link href="/" className={cls("/")} aria-current={cur("/")}>
              Home
            </Link>
            <Link href="/about" className={cls("/about")} aria-current={cur("/about")}>
              About
            </Link>
            <div className={`nav-drop${servicesActive ? " active" : ""}`}>
              <Link
                href="/services"
                className="drop-toggle"
                aria-current={servicesActive ? "page" : undefined}
              >
                Services <Chevron />
              </Link>
              <div className="drop-menu" role="menu" aria-label="Services">
                <Link href="/services" className="drop-all">
                  All services
                </Link>
                {SERVICE_MENU.map((s) => (
                  <Link key={s.slug} href={`/services/${s.slug}`}>
                    {s.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/faq" className={cls("/faq")} aria-current={cur("/faq")}>
              FAQ
            </Link>
            <Link href="/contact" className={cls("/contact")} aria-current={cur("/contact")}>
              Contact
            </Link>
          </nav>
          <div className="header-cta">
            <a href={`tel:${PHONE_TEL}`} className="header-phone">
              <PhoneIcon /> {PHONE_DISPLAY}
            </a>
            <a href={WA_URL} className="btn btn-primary" target="_blank" rel="noopener">
              Request a Free Quote
            </a>
          </div>
          <button
            className="burger"
            id="burger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} id="mobileMenu">
        <Link href="/" className={cls("/")} aria-current={cur("/")}>
          Home
        </Link>
        <Link href="/about" className={cls("/about")} aria-current={cur("/about")}>
          About
        </Link>
        <Link href="/services" className={pathname === "/services" ? "active" : undefined}>
          Services
        </Link>
        {SERVICE_MENU.map((s) => (
          <Link key={s.slug} href={`/services/${s.slug}`} className="sub">
            {s.label}
          </Link>
        ))}
        <Link href="/faq" className={cls("/faq")}>
          FAQ
        </Link>
        <Link href="/contact" className={cls("/contact")}>
          Contact
        </Link>
        <a href={`tel:${PHONE_TEL}`}>Call {PHONE_DISPLAY}</a>
        <a href={WA_URL} className="btn btn-primary" target="_blank" rel="noopener">
          Request a Free Quote
        </a>
      </div>
    </>
  );
}
