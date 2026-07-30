"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SERVICE_MENU, WA_URL } from "@/lib/site";

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
      <path d="m6 9 6 6 6-6" />
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
            <Link href="/projects" className={cls("/projects")} aria-current={cur("/projects")}>
              Our Projects
            </Link>
            <Link href="/faq" className={cls("/faq")} aria-current={cur("/faq")}>
              FAQ
            </Link>
            <Link href="/contact" className={cls("/contact")} aria-current={cur("/contact")}>
              Contact
            </Link>
          </nav>
          <div className="header-cta">
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
        <Link href="/projects" className={cls("/projects")}>
          Our Projects
        </Link>
        <Link href="/faq" className={cls("/faq")}>
          FAQ
        </Link>
        <Link href="/contact" className={cls("/contact")}>
          Contact
        </Link>
        <a href={WA_URL} className="btn btn-primary" target="_blank" rel="noopener">
          Request a Free Quote
        </a>
      </div>
    </>
  );
}
