import { db } from "@/db";
import { products } from "@/db/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function authorized() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return true;
  const { data } = await supabase.auth.getUser();
  return data.user?.app_metadata?.role === "admin";
}

export async function GET() {
  if (!await authorized()) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  if (!await authorized()) return NextResponse.json({ error: "ACESSO NEGADO." }, { status: 403 });
  const body = await request.json().catch(() => null) as null | Record<string, unknown>;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const sku = typeof body?.sku === "string" ? body.sku.trim().toUpperCase() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const price = Number(body?.price);
  if (!name || !sku || !description || !Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "PREENCHA NOME, SKU, DESCRIÇÃO E PREÇO." }, { status: 422 });
  const existing = await db.select({ id: products.id }).from(products).where(eq(products.sku, sku)).limit(1);
  if (existing.length) return NextResponse.json({ error: "SKU JÁ EXISTE NO CATÁLOGO." }, { status: 409 });
  const baseSlug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string") : [];
  const images = Array.isArray(body?.images) ? body.images.filter((image): image is string => typeof image === "string" && image.startsWith("http")) : [];
  const [created] = await db.insert(products).values({
    name, slug, sku, description, priceCents: Math.round(price * 100),
    costCents: Number.isFinite(Number(body?.cost)) ? Math.round(Number(body?.cost) * 100) : null,
    tags, images, active: true,
  }).returning({ id: products.id, slug: products.slug });
  return NextResponse.json(created, { status: 201 });
}
