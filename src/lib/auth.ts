import "server-only";
import { createClient } from "@/lib/supabase/server";

export class AuthError extends Error {
  constructor(public code: "UNAUTHENTICATED" | "FORBIDDEN") {
    super(code);
    this.name = "AuthError";
  }
}

/** The current signed-in user, or null. Revalidates the token with Supabase. */
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Whether the current user is an admin (public.is_admin() RPC). */
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

/**
 * Server-side guard for every admin mutation (the DAL / defense-in-depth check
 * required by the spec — independent of middleware). Throws AuthError otherwise.
 * Returns the authed Supabase client + user so callers reuse the same session.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new AuthError("UNAUTHENTICATED");

  const { data, error } = await supabase.rpc("is_admin");
  if (error || data !== true) throw new AuthError("FORBIDDEN");

  return { supabase, user };
}
