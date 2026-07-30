"use client";

import { useEffect } from "react";
import { sendEnquiryAction } from "@/app/contact/actions";

/**
 * The contact "Request a quote" form is injected as static HTML, so we wire the
 * submit button on mount to a Server Action that emails the enquiry via Resend,
 * showing inline status feedback.
 */
export function ContactFormScript() {
  useEffect(() => {
    const btn = document.getElementById("quoteSubmit") as HTMLButtonElement | null;
    if (!btn) return;

    // status line under the button
    let status = document.getElementById("enquiryStatus");
    if (!status) {
      status = document.createElement("p");
      status.id = "enquiryStatus";
      status.setAttribute("role", "status");
      status.style.marginTop = "12px";
      status.style.fontWeight = "600";
      btn.insertAdjacentElement("afterend", status);
    }

    const val = (id: string) =>
      (
        document.getElementById(id) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | null
      )?.value.trim() || "";

    const say = (msg: string, ok: boolean) => {
      status!.textContent = msg;
      status!.style.color = ok ? "#1a7f43" : "#b3261e";
    };

    const handler = async (e: Event) => {
      e.preventDefault();
      const data = {
        name: val("f-name"),
        phone: val("f-phone"),
        email: val("f-email"),
        type: val("f-type"),
        message: val("f-msg"),
      };
      if (!data.name || (!data.phone && !data.email)) {
        say("Please add your name and a phone or email so we can reply.", false);
        return;
      }

      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Sending…";
      status!.textContent = "";

      const res = await sendEnquiryAction(data);

      btn.disabled = false;
      btn.textContent = original;

      if (res.ok) {
        say("Thanks — your enquiry has been sent. We'll be in touch shortly.", true);
        ["f-name", "f-phone", "f-email", "f-msg"].forEach((id) => {
          const el = document.getElementById(id) as HTMLInputElement | null;
          if (el) el.value = "";
        });
      } else {
        say(res.error || "Something went wrong. Please try again.", false);
      }
    };

    btn.addEventListener("click", handler);
    return () => btn.removeEventListener("click", handler);
  }, []);

  return null;
}
