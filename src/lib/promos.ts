import "server-only";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { PromoInputSchema, UuidSchema, type PromoInput } from "@/lib/validation";

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

type Row = {
  id: string;
  title: string;
  badge: string | null;
  description: string;
  price_or_discount: string | null;
  image_path: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

function mapRow(r: Row): Promo {
  return {
    id: r.id,
    title: r.title,
    badge: r.badge,
    description: r.description,
    priceOrDiscount: r.price_or_discount,
    imagePath: r.image_path,
    startsAt: r.starts_at,
    endsAt: r.ends_at,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

/** True once the public Supabase env vars are set. */
function hasSupabaseEnv(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function toRow(input: PromoInput) {
  return {
    title: input.title,
    badge: input.badge,
    description: input.description,
    price_or_discount: input.priceOrDiscount,
    image_path: input.imagePath,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    is_active: input.isActive,
  };
}

/** Never leak DB details to the client. Log with a correlation id, return a ref. */
function fail(context: string, error: unknown): never {
  const cid = randomUUID();
  console.error(`[promos:${context}] cid=${cid}`, error);
  throw new Error(`Something went wrong. (ref ${cid})`);
}

// ---------- public reads (anon; RLS + explicit visible filter) ----------

export async function getLatestPromo(): Promise<Promo | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[promos:getLatestPromo]", error);
    return null;
  }
  return data ? mapRow(data as Row) : null;
}

export async function getAllActivePromos(): Promise<Promo[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("is_active", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gte.${now}`)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[promos:getAllActivePromos]", error);
    return [];
  }
  return (data as Row[]).map(mapRow);
}

// ---------- admin reads + mutations (requireAdmin + RLS) ----------

export async function listAllPromos(): Promise<Promo[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) fail("listAllPromos", error);
  return (data as Row[]).map(mapRow);
}

export async function getPromo(id: string): Promise<Promo | null> {
  const { supabase } = await requireAdmin();
  const uid = UuidSchema.parse(id);
  const { data, error } = await supabase
    .from("promos")
    .select("*")
    .eq("id", uid)
    .maybeSingle();
  if (error) fail("getPromo", error);
  return data ? mapRow(data as Row) : null;
}

export async function createPromo(input: PromoInput): Promise<Promo> {
  const { supabase } = await requireAdmin();
  const parsed = PromoInputSchema.parse(input);
  const { data, error } = await supabase
    .from("promos")
    .insert(toRow(parsed))
    .select("*")
    .single();
  if (error) fail("createPromo", error);
  return mapRow(data as Row);
}

export async function updatePromo(id: string, input: PromoInput): Promise<Promo> {
  const { supabase } = await requireAdmin();
  const uid = UuidSchema.parse(id);
  const parsed = PromoInputSchema.parse(input);
  const { data, error } = await supabase
    .from("promos")
    .update(toRow(parsed))
    .eq("id", uid)
    .select("*")
    .single();
  if (error) fail("updatePromo", error);
  return mapRow(data as Row);
}

export async function deletePromo(id: string): Promise<void> {
  const { supabase } = await requireAdmin();
  const uid = UuidSchema.parse(id);
  const { error } = await supabase.from("promos").delete().eq("id", uid);
  if (error) fail("deletePromo", error);
}

export async function setPromoActive(id: string, isActive: boolean): Promise<void> {
  const { supabase } = await requireAdmin();
  const uid = UuidSchema.parse(id);
  const { error } = await supabase
    .from("promos")
    .update({ is_active: isActive })
    .eq("id", uid);
  if (error) fail("setPromoActive", error);
}
