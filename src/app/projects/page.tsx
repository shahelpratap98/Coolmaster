import type { Metadata } from "next";
import Link from "next/link";
import { WA_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Our Projects | CoolMaster Services" },
  description:
    "A showcase of CoolMaster's heat pump, air conditioning and refrigeration projects across Auckland — coming soon.",
  robots: { index: false, follow: true },
};

export default function ProjectsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Our Projects</span>
          </div>
          <span className="eyebrow">Our projects</span>
          <h1>Our projects — coming soon</h1>
          <p>
            We&apos;re putting together a showcase of our recent heat pump, air
            conditioning and refrigeration work across Auckland. Check back
            soon — or get in touch to talk about yours.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="uc-actions">
            <a href={WA_URL} className="btn btn-primary" target="_blank" rel="noopener">
              Request a Free Quote
            </a>
            <Link href="/services" className="uc-link">
              Browse our services →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
