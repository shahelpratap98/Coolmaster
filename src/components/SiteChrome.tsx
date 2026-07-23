"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { RevealAnimations } from "./RevealAnimations";

/**
 * Marketing chrome (header/footer/FAB/reveal) for the public site.
 * Admin routes render bare — they supply their own chrome in admin/layout.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
      <RevealAnimations />
    </>
  );
}
