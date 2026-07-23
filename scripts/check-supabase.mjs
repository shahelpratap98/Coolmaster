// Quick connectivity + schema check. Run: node scripts/check-supabase.mjs
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const get = (k) => (env.match(new RegExp(`^${k}=(.*)$`, "m")) || [])[1]?.trim();
const url = get("NEXT_PUBLIC_SUPABASE_URL");
const key = get("NEXT_PUBLIC_SUPABASE_ANON_KEY");

console.log("URL:", url);
console.log("Key:", key ? key.slice(0, 16) + "…(" + key.length + " chars)" : "MISSING");

const supabase = createClient(url, key);

// 1) Can we reach the promos table? (tells us if the migration has run)
const promos = await supabase.from("promos").select("id").limit(1);
if (promos.error) {
  console.log("\npromos table: ERROR ->", promos.error.code, promos.error.message);
} else {
  console.log("\npromos table: OK (rows visible to anon:", promos.data.length + ")");
}

// 2) Is the is_admin() function present?
const rpc = await supabase.rpc("is_admin");
if (rpc.error) {
  console.log("is_admin() rpc: ERROR ->", rpc.error.code, rpc.error.message);
} else {
  console.log("is_admin() rpc: OK (returns", rpc.data + " for anon)");
}
