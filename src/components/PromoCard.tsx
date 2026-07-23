import { WA_URL } from "@/lib/site";
import { promoImageUrl } from "@/lib/storage";
import type { PromoView } from "@/lib/promo-types";

export function PromoCard({
  promo,
  cta = true,
}: {
  promo: PromoView;
  cta?: boolean;
}) {
  const img = promoImageUrl(promo.imagePath);
  return (
    <article className="promo-card">
      {img ? (
        <div className="promo-card-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt="" loading="lazy" />
        </div>
      ) : null}
      <div className="promo-card-body">
        {promo.badge ? <span className="promo-card-badge">{promo.badge}</span> : null}
        <h3 className="promo-card-title">{promo.title || "Promo title"}</h3>
        {promo.priceOrDiscount ? (
          <p className="promo-card-price">{promo.priceOrDiscount}</p>
        ) : null}
        {promo.description ? (
          <p className="promo-card-desc">{promo.description}</p>
        ) : null}
        {cta ? (
          <a className="btn btn-primary" href={WA_URL} target="_blank" rel="noopener">
            Request a Free Quote
          </a>
        ) : null}
      </div>
    </article>
  );
}
