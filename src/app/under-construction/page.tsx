import type { Metadata } from "next";
import Link from "next/link";
import { WA_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Coming Soon | CoolMaster Services" },
  description: "This page is under construction and coming soon.",
  robots: { index: false, follow: true },
};

export default function UnderConstructionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span className="here">Coming soon</span>
          </div>
          <span className="eyebrow">Under construction</span>
          <h1>This page is coming soon</h1>
          <p>
            We&apos;re putting the finishing touches on this part of the site.
            In the meantime, we&apos;re ready to help across Auckland — get in
            touch for a free quote.
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
