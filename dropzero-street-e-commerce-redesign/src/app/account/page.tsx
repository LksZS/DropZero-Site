import { AuthPanel } from "@/components/auth-panel";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Minha conta" };

export default function AccountPage() {
  return <main className="page-shell account-page"><AuthPanel /><SiteFooter /></main>;
}
