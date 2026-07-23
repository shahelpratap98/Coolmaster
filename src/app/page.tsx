import { PAGES } from "@/content/pages.generated";
import { HomePromoCard } from "@/components/HomePromoCard";

// Insert the promo banner right after the trust strip (before the first
// content section), matching where the static PROMO marker would sit.
const MARKER = '<section class="section"';

function splitHome(html: string): [string, string] {
  const i = html.indexOf(MARKER);
  if (i < 0) return [html, ""];
  return [html.slice(0, i), html.slice(i)];
}

export default function HomePage() {
  const [before, after] = splitHome(PAGES.home.html);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: before }} />
      <HomePromoCard />
      <div dangerouslySetInnerHTML={{ __html: after }} />
    </>
  );
}
