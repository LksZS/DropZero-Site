import { ProductDetails } from "@/components/product-details";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { getProduct, products } from "@/lib/catalog";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return product ? { title: product.name, description: product.description } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.id !== product.id && (item.category === product.category || item.drop === product.drop)).slice(0, 3);

  return (
    <main className="page-shell product-page">
      <ProductDetails product={product} />
      <section className="reviews-section">
        <div className="reviews-score"><span>AVALIAÇÕES / VERIFIED BUYERS</span><strong>{product.rating.toFixed(1)}</strong><div className="stars-text">★★★★★</div><small>{String(product.reviews).padStart(3, "0")} REVIEWS</small></div>
        <div className="review-quote"><span>REVIEW / 127-A</span><blockquote>“A modelagem é realmente pesada e a peça fica melhor depois de usada. Chegou rápido e a embalagem parece um zine.”</blockquote><cite>CAIO M. / COMPRA VERIFICADA</cite></div>
      </section>
      <section className="related-section">
        <div className="related-title"><span>VOCÊ TAMBÉM PODE OCUPAR</span><h2>MESMA<br />FREQUÊNCIA.</h2></div>
        <div className="related-grid">{related.map((item, index) => <Reveal delay={index * 70} key={item.id}><ProductCard product={item} index={index} /></Reveal>)}</div>
      </section>
      <SiteFooter />
    </main>
  );
}
