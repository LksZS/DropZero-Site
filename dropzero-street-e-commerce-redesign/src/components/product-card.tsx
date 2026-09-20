"use client";

import type { CatalogProduct } from "@/lib/catalog";
import { formatBRL } from "@/lib/catalog";
import { ArrowUpRight, Heart, Plus } from "lucide-react";
import Link from "next/link";
import { useStore } from "./store-provider";

export function ProductCard({ product, index = 0 }: { product: CatalogProduct; index?: number }) {
  const { addItem, favorites, toggleFavorite } = useStore();
  const favorite = favorites.includes(product.id);

  return (
    <article className={`product-card offset-${index % 3}`}>
      <div className="product-image-wrap">
        <Link href={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}>
          <img className="product-image primary" src={product.images[0]} alt={product.name} />
          <img className="product-image secondary" src={product.images[1]} alt="" />
          <span className="image-code">IMG / DZ-{product.id}</span>
          {product.limited && <span className="limited-stamp">LIMITED</span>}
          {product.stock === 0 && <span className="sold-paste">ESGOTADO</span>}
        </Link>
        <button className={`favorite-button ${favorite ? "is-active" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}><Heart /></button>
        <div className="hover-specs">
          <span>{product.colors[0]}</span><span>{product.sizes.join(" / ")}</span>
        </div>
      </div>
      <div className="product-card-info">
        <div className="product-index">[{String(index + 1).padStart(2, "0")}]</div>
        <div>
          <span className="micro">DROP ZERO / {product.drop}</span>
          <h3><Link href={`/produto/${product.slug}`}>{product.shortName}</Link></h3>
          <div className="product-price">
            <strong>{formatBRL(product.price)}</strong>
            {product.oldPrice && <del>{formatBRL(product.oldPrice)}</del>}
          </div>
        </div>
        <button className="quick-add" disabled={product.stock === 0} onClick={() => addItem(product)} aria-label={`Adicionar ${product.name} à bag`}>
          {product.stock === 0 ? <span>OUT</span> : <><Plus /><span>BAG</span></>}
        </button>
      </div>
      <Link href={`/produto/${product.slug}`} className="product-file-link">ABRIR FICHA <ArrowUpRight /></Link>
    </article>
  );
}
