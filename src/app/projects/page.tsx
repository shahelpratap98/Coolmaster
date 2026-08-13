import type { Metadata } from "next";
import Link from "next/link";
import { WA_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Our Projects | CoolMaster Services" },
  description:
    "Recent heat pump, air conditioning and commercial refrigeration projects by CoolMaster Services across Auckland.",
};

const PROJECTS = [
  {
    src: "/project-1.jpg",
    caption:
      "Gree inverter heat pump installed on a commercial rooftop — system evacuated and commissioned, Auckland.",
  },
  {
    src: "/project-2.jpg",
    caption: "Fujitsu Airstage high-wall unit — a clean, discreet indoor finish.",
  },
  {
    src: "/project-3.jpg",
    caption:
      "Mitsubishi Electric outdoor unit, neatly bracket-mounted and commissioned.",
  },
  {
    src: "/project-4.jpg",
    caption: "Wall-mounted Fujitsu Airstage in a new-build living space.",
  },
  {
    src: "/project-5.jpg",
    caption: "Coolroom evaporator serviced for a commercial site.",
  },
  {
    src: "/project-6.jpg",
    caption: "New condenser fans fitted to a commercial refrigeration plant.",
  },
  {
    src: "/project-7.jpg",
    caption: "Deep foam clean of a commercial refrigeration coil.",
  },
  {
    src: "/project-8.jpg",
    caption:
      "On-site diagnostics — refrigerant pressures and temperatures checked.",
  },
];

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
          <h1>Recent work across Auckland</h1>
          <p>
            A snapshot of our heat pump and air conditioning installs, commercial
            refrigeration, and servicing — done right and built to last.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="project-grid">
            {PROJECTS.map((p, i) => (
              <figure className="project-card" key={p.src}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.caption}
                  width={1200}
                  height={900}
                  loading={i < 2 ? "eager" : "lazy"}
                />
                <figcaption>{p.caption}</figcaption>
              </figure>
            ))}
          </div>

          <div className="uc-actions" style={{ marginTop: "36px" }}>
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
