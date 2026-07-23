"use client";

import { useEffect, useState } from "react";

const KEY = "coolmaster-promo-dismissed";

/**
 * Wraps the home promo in a dismissible container. The dismissed promo id is
 * remembered in localStorage (UI preference only — never used for auth).
 */
export function PromoDismiss({
  promoId,
  children,
}: {
  promoId: string;
  children: React.ReactNode;
}) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(KEY) === promoId);
  }, [promoId]);

  if (dismissed) return null;

  return (
    <div className="home-promo-wrap">
      {children}
      <button
        type="button"
        className="home-promo-dismiss"
        aria-label="Dismiss this offer"
        onClick={() => {
          localStorage.setItem(KEY, promoId);
          setDismissed(true);
        }}
      >
        ×
      </button>
    </div>
  );
}
