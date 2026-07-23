"use client";

import { useActionState, useState } from "react";
import {
  createPromoAction,
  updatePromoAction,
  uploadPromoImageAction,
  type FormState,
} from "../actions";
import { PromoCard } from "@/components/PromoCard";
import type { Promo } from "@/lib/promo-types";

function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function PromoForm({ promo }: { promo: Promo | null }) {
  const editing = !!promo;
  const action = editing ? updatePromoAction : createPromoAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined
  );

  const [f, setF] = useState({
    title: promo?.title ?? "",
    badge: promo?.badge ?? "",
    description: promo?.description ?? "",
    priceOrDiscount: promo?.priceOrDiscount ?? "",
    imagePath: promo?.imagePath ?? "",
    startsAt: toLocalInput(promo?.startsAt),
    endsAt: toLocalInput(promo?.endsAt),
    isActive: promo?.isActive ?? false,
  });

  const upd =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((s) => ({
        ...s,
        [k]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
      }));

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be 2MB or smaller.");
      e.target.value = "";
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    const res = await uploadPromoImageAction(fd);
    setUploading(false);
    e.target.value = "";
    if (!res.ok) {
      setUploadError(res.error);
      return;
    }
    setF((s) => ({ ...s, imagePath: res.path }));
  }

  return (
    <div className="admin-grid">
      <form action={formAction} className="admin-form admin-card">
        <h2>{editing ? "Edit promo" : "New promo"}</h2>
        {editing ? <input type="hidden" name="id" value={promo!.id} /> : null}

        <label className="admin-field">
          Title
          <input name="title" value={f.title} onChange={upd("title")} required maxLength={120} />
        </label>

        <label className="admin-field">
          Badge / tagline
          <input name="badge" value={f.badge} onChange={upd("badge")} maxLength={40} placeholder="e.g. Winter Special" />
        </label>

        <label className="admin-field">
          Description
          <textarea name="description" value={f.description} onChange={upd("description")} required maxLength={2000} />
        </label>

        <label className="admin-field">
          Price / discount
          <input name="priceOrDiscount" value={f.priceOrDiscount} onChange={upd("priceOrDiscount")} maxLength={60} placeholder="e.g. From $1,899 installed" />
        </label>

        <label className="admin-field">
          Image URL or path (optional)
          <input name="imagePath" value={f.imagePath} onChange={upd("imagePath")} maxLength={300} placeholder="https://… or upload below" />
        </label>

        <div className="admin-field">
          Or upload an image (JPEG / PNG / WebP / GIF, max 2MB)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            disabled={uploading}
          />
          {uploading ? <span className="muted">Uploading…</span> : null}
          {uploadError ? <span className="admin-error">{uploadError}</span> : null}
        </div>

        <div className="row">
          <label className="admin-field">
            Starts (optional)
            <input type="datetime-local" name="startsAt" value={f.startsAt} onChange={upd("startsAt")} />
          </label>
          <label className="admin-field">
            Ends (optional)
            <input type="datetime-local" name="endsAt" value={f.endsAt} onChange={upd("endsAt")} />
          </label>
        </div>

        <label className="admin-field admin-check">
          <input type="checkbox" name="isActive" checked={f.isActive} onChange={upd("isActive")} />
          Published (visible on the site)
        </label>

        {state?.error ? <p className="admin-error">{state.error}</p> : null}

        <div className="admin-actions">
          <button className="admin-btn" type="submit" disabled={pending}>
            {pending ? "Saving…" : editing ? "Save changes" : "Create promo"}
          </button>
          {editing ? (
            <a className="admin-btn ghost" href="/admin/promos">
              Cancel
            </a>
          ) : null}
        </div>
      </form>

      <div className="admin-preview">
        <h2>Live preview</h2>
        <PromoCard
          cta={false}
          promo={{
            title: f.title,
            badge: f.badge || null,
            description: f.description,
            priceOrDiscount: f.priceOrDiscount || null,
            imagePath: f.imagePath || null,
          }}
        />
      </div>
    </div>
  );
}
