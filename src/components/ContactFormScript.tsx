"use client";

import { useEffect } from "react";
import { EMAIL } from "@/lib/site";

/**
 * Re-attaches the original contact "Request a quote" behaviour: builds a
 * mailto: link from the form fields. The form markup is injected as static
 * HTML, so we wire the handler on mount.
 */
export function ContactFormScript() {
  useEffect(() => {
    const qs = document.getElementById("quoteSubmit");
    if (!qs) return;

    const val = (id: string) => {
      const el = document.getElementById(id) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
        | null;
      return (el?.value || "").trim();
    };

    const handler = () => {
      const name = val("f-name");
      const phone = val("f-phone");
      const email = val("f-email");
      const type = val("f-type");
      const msg = val("f-msg");
      if (!name || (!phone && !email)) {
        alert("Please add your name and a phone or email so we can reply.");
        return;
      }
      const subject = `Quote request: ${type} — ${name}`;
      const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${type}\n\nDetails:\n${msg}\n`;
      window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    };

    qs.addEventListener("click", handler);
    return () => qs.removeEventListener("click", handler);
  }, []);

  return null;
}
