import type { Metadata } from "next";
import { getAllActivePromos } from "@/lib/promos";
import { PromoCard } from "@/components/PromoCard";
import { WA_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Heat Pump Specials & Promotions Auckland | CoolMaster",
  },
  description:
    "Current heat pump, air conditioning and refrigeration specials from CoolMaster Services — Auckland. Request a free quote.",
};

export const dynamic = "force-dynamic";

export default async function SpecialsPage() {
  const promos = await getAllActivePromos();

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="crumbs">
            <a href="/">Home</a>
            <span className="sep">/</span>
            <span className="here">Specials</span>
          </div>
          <span className="eyebrow">Current offers</span>
          <h1>Heat pump &amp; air conditioning specials</h1>
          <p>
            Seasonal deals on installation, servicing and refrigeration for
            Auckland homes and businesses.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          {promos.length === 0 ? (
            <p className="empty-specials">
              No current specials right now —{" "}
              <a href={WA_URL} target="_blank" rel="noopener">
                request a free quote
              </a>{" "}
              and we&apos;ll sort you out.
            </p>
          ) : (
            <div className="promo-grid">
              {promos.map((p) => (
                <PromoCard key={p.id} promo={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
