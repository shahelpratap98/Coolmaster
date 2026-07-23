// Client-safe promo types (no server-only imports).
export type Promo = {
  id: string;
  title: string;
  badge: string | null;
  description: string;
  priceOrDiscount: string | null;
  imagePath: string | null;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** The subset needed to render a promo card / preview. */
export type PromoView = Pick<
  Promo,
  "title" | "badge" | "description" | "priceOrDiscount" | "imagePath"
>;
