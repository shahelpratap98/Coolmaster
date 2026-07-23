import { redirect } from "next/navigation";
import { listAllPromos, getPromo } from "@/lib/promos";
import { AuthError } from "@/lib/auth";
import type { Promo } from "@/lib/promo-types";
import { PromoForm } from "./PromoForm";
import { logoutAction, deletePromoAction, togglePromoAction } from "../actions";

export const dynamic = "force-dynamic";

function scheduleLabel(p: Promo): string {
  const parts: string[] = [];
  if (p.startsAt) parts.push(`from ${new Date(p.startsAt).toLocaleDateString()}`);
  if (p.endsAt) parts.push(`until ${new Date(p.endsAt).toLocaleDateString()}`);
  return parts.length ? ` · ${parts.join(" ")}` : "";
}

export default async function PromosPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;

  let promos: Promo[];
  try {
    promos = await listAllPromos();
  } catch (e) {
    if (e instanceof AuthError) redirect("/admin/login");
    throw e;
  }

  let editing: Promo | null = null;
  if (edit) {
    try {
      editing = await getPromo(edit);
    } catch {
      editing = null;
    }
  }

  return (
    <>
      <div className="admin-bar">
        <div className="wrap">
          <h1>CoolMaster — Promos</h1>
          <form action={logoutAction}>
            <button className="admin-btn ghost" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="admin-main">
        <PromoForm promo={editing} key={editing?.id ?? "new"} />

        <div className="admin-list">
          <h2>All promos ({promos.length})</h2>
          {promos.length === 0 ? (
            <p className="empty">No promos yet. Create your first one above.</p>
          ) : (
            promos.map((p) => (
              <div className="promo-row" key={p.id}>
                <div>
                  <strong>{p.title}</strong>
                  <span className={`tag ${p.isActive ? "live" : "draft"}`}>
                    {p.isActive ? "Published" : "Draft"}
                  </span>
                  <div className="meta">
                    {p.badge ? `${p.badge} · ` : ""}
                    {p.priceOrDiscount ?? ""}
                    {scheduleLabel(p)}
                  </div>
                </div>
                <div className="admin-actions">
                  <a className="admin-btn subtle" href={`/admin/promos?edit=${p.id}`}>
                    Edit
                  </a>
                  <form action={togglePromoAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="isActive" value={(!p.isActive).toString()} />
                    <button className="admin-btn ghost" type="submit">
                      {p.isActive ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                  <form action={deletePromoAction}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="admin-btn danger" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
