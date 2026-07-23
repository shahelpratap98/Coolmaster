// Resolves a promo image reference to a URL.
// Accepts either a full http(s) URL or a Supabase Storage object path in the
// public "promo-images" bucket.
export function promoImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return null;
  return `${base}/storage/v1/object/public/promo-images/${path.replace(/^\/+/, "")}`;
}
