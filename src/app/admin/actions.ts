"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@/lib/auth";
import {
  createPromo,
  updatePromo,
  deletePromo,
  setPromoActive,
} from "@/lib/promos";
import { rateLimit } from "@/lib/ratelimit";

export type FormState = { error?: string; ok?: boolean } | undefined;

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(3)
    .max(200)
    .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Enter a valid email."),
  password: z.string().min(1).max(200),
});

async function clientIp() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

// ---------------- auth ----------------

export async function loginAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const ip = await clientIp();
  const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  // Generic message — never reveal whether the email exists.
  if (error) {
    return { error: "Invalid email or password." };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "This account is not authorised for admin access." };
  }

  redirect("/admin/promos");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------------- promo CRUD ----------------

function readPromoForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    badge: String(formData.get("badge") ?? ""),
    description: String(formData.get("description") ?? ""),
    priceOrDiscount: String(formData.get("priceOrDiscount") ?? ""),
    imagePath: String(formData.get("imagePath") ?? ""),
    startsAt: String(formData.get("startsAt") ?? ""),
    endsAt: String(formData.get("endsAt") ?? ""),
    isActive:
      formData.get("isActive") === "on" || formData.get("isActive") === "true",
  };
}

function handleError(err: unknown): FormState {
  if (err instanceof AuthError) {
    return { error: "Your session has expired. Please sign in again." };
  }
  if (err instanceof z.ZodError) {
    return { error: err.issues[0]?.message ?? "Please check the form and try again." };
  }
  if (err instanceof Error) {
    return { error: err.message };
  }
  return { error: "Something went wrong." };
}

export async function createPromoAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await createPromo(readPromoForm(formData));
  } catch (err) {
    return handleError(err);
  }
  revalidatePath("/admin/promos");
  revalidatePath("/");
  revalidatePath("/specials");
  redirect("/admin/promos");
}

export async function updatePromoAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const id = String(formData.get("id") ?? "");
  try {
    await updatePromo(id, readPromoForm(formData));
  } catch (err) {
    return handleError(err);
  }
  revalidatePath("/admin/promos");
  revalidatePath("/");
  revalidatePath("/specials");
  redirect("/admin/promos");
}

export async function deletePromoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deletePromo(id);
  revalidatePath("/admin/promos");
  revalidatePath("/");
  revalidatePath("/specials");
}

export async function togglePromoAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";
  await setPromoActive(id, isActive);
  revalidatePath("/admin/promos");
  revalidatePath("/");
  revalidatePath("/specials");
}
