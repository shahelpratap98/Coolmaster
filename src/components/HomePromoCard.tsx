import { getLatestPromo } from "@/lib/promos";
import { PromoCard } from "./PromoCard";
import { PromoDismiss } from "./PromoDismiss";

/**
 * Renders the single most recent active promo as a compact home banner.
 * Renders nothing when there is no active promo (no clutter).
 */
export async function HomePromoCard() {
  const promo = await getLatestPromo();
  if (!promo) return null;

  return (
    <section className="home-promo">
      <div className="wrap">
        <PromoDismiss promoId={promo.id}>
          <PromoCard promo={promo} />
        </PromoDismiss>
      </div>
    </section>
  );
}
