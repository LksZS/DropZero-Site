import { AdminDashboard } from "@/components/admin-dashboard";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Control / Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    if (!data.user || data.user.app_metadata?.role !== "admin") redirect("/account?next=/admin");
  }
  return <AdminDashboard />;
}
