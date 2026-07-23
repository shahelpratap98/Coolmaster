import { redirect } from "next/navigation";

// Bare /admin -> dashboard (middleware bounces to /admin/login when signed out).
export default function AdminIndex() {
  redirect("/admin/promos");
}
