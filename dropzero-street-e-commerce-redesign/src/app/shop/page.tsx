import { ShopClient } from "@/components/shop-client";
import { SiteFooter } from "@/components/site-footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop", description: "Todas as peças e drops DropZero." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  return (
    <main className="page-shell shop-page">
      <header className="inner-masthead"><div><span className="eyebrow">DZ / CATALOG ARCHIVE</span><h1>SHOP<span>.</span></h1></div><p>TODAS AS PEÇAS. TODOS OS DROPS. POUCO ESTOQUE E NENHUMA PROMESSA DE VOLTA.</p></header>
      <ShopClient initialCategory={categoria} />
      <SiteFooter />
    </main>
  );
}
