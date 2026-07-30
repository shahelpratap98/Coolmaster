"use server";

import { randomUUID } from "crypto";
import { z } from "zod";
import { rateLimit } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/request";

const EnquirySchema = z
  .object({
    name: z.string().trim().min(1, "Please add your name.").max(120),
    phone: z.string().trim().max(40).optional().transform((v) => v ?? ""),
    email: z.string().trim().max(200).optional().transform((v) => v ?? ""),
    type: z.string().trim().max(120).optional().transform((v) => v ?? ""),
    message: z.string().trim().max(4000).optional().transform((v) => v ?? ""),
  })
  .strict()
  .refine((d) => d.phone.length > 0 || d.email.length > 0, {
    message: "Add a phone or email so we can reply.",
    path: ["email"],
  });

export type EnquiryState = { ok: boolean; error?: string };

const TO = "shivcoolmaster@gmail.com";

export async function sendEnquiryAction(input: unknown): Promise<EnquiryState> {
  const ip = await getClientIp();
  const rl = await rateLimit("contact", ip);
  if (!rl.ok) {
    return {
      ok: false,
      error: "You've sent a few enquiries already — please wait a little while before sending another.",
    };
  }

  const parsed = EnquirySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }
  const { name, phone, email, type, message } = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[enquiry] RESEND_API_KEY is not set");
    return { ok: false, error: "The enquiry form isn't configured yet. Please email us directly." };
  }

  // Until a domain is verified in Resend, the default sender only delivers to
  // the Resend account owner's address. Set RESEND_FROM once a domain is verified.
  const from = process.env.RESEND_FROM || "CoolMaster Website <onboarding@resend.dev>";
  const subject = `New website enquiry${type ? `: ${type}` : ""} — ${name}`;
  const text = [
    `Name: ${name}`,
    `Phone: ${phone || "—"}`,
    `Email: ${email || "—"}`,
    `Service: ${type || "—"}`,
    "",
    "Message:",
    message || "—",
    "",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [TO],
        subject,
        text,
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!res.ok) {
      const cid = randomUUID();
      const body = await res.text().catch(() => "");
      console.error(`[enquiry] resend ${res.status} cid=${cid}`, body);
      return { ok: false, error: `Couldn't send your enquiry right now. Please try again or email us. (ref ${cid})` };
    }
    return { ok: true };
  } catch (err) {
    const cid = randomUUID();
    console.error(`[enquiry] cid=${cid}`, err);
    return { ok: false, error: `Couldn't send your enquiry right now. Please try again. (ref ${cid})` };
  }
}
