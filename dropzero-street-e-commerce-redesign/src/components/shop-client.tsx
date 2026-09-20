"use client";

import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const categories = ["todos", "camisetas", "hoodies", "calcas", "jaquetas", "acessorios"];

export function ShopClient({ initialCategory = "todos" }: { initialCategory?: string }) {
  const [category, setCategory] = useState(categories.includes(initialCategory) ? initialCategory : "todos");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    const result = products.filter((product) => (category === "todos" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase()));
    if (sort === "price-low") return [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...result].sort((a, b) => b.price - a.price);
    if (sort === "new") return [...result].reverse();
    return result;
  }, [category, query, sort]);

  return (
    <section className="shop-content">
      <div className="shop-toolbar">
        <button className="filter-mobile-trigger" onClick={() => setFilterOpen(true)}><Filter /> FILTRAR</button>
        <div className="shop-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="BUSCAR NO ARQUIVO" aria-label="Buscar no catálogo" /></div>
        <span className="result-count">{String(filtered.length).padStart(2, "0")} / ITEMS</span>
        <label className="sort-control"><SlidersHorizontal /><span>ORDENAR</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">DESTAQUES</option><option value="new">MAIS NOVOS</option><option value="price-low">MENOR PREÇO</option><option value="price-high">MAIOR PREÇO</option></select></label>
      </div>
      <div className="shop-main">
        <aside className={`shop-filters ${filterOpen ? "is-open" : ""}`}>
          <div className="filter-drawer-head"><span>FILTROS / INDEX</span><button onClick={() => setFilterOpen(false)}><X /></button></div>
          <div className="filter-group"><span>CATEGORIA</span>{categories.map((item, index) => <button className={category === item ? "active" : ""} onClick={() => { setCategory(item); setFilterOpen(false); }} key={item}><i>0{index + 1}</i>{item === "todos" ? "TODAS AS PEÇAS" : item.toUpperCase()}<b>{item === "todos" ? products.length : products.filter((product) => product.category === item).length}</b></button>)}</div>
          <div className="filter-group static"><span>DISPONIBILIDADE</span><label><input type="checkbox" defaultChecked /> EM ESTOQUE</label><label><input type="checkbox" /> EDIÇÃO LIMITADA</label></div>
          <div className="filter-note">ARCHIVE UPDATED<br />21.02.26 / 22:17</div>
        </aside>
        <div className="shop-grid">{filtered.map((product, index) => <ProductCard product={product} index={index} key={product.id} />)}{filtered.length === 0 && <div className="shop-empty"><strong>ZERO.</strong><p>Nenhuma peça encontrada nesse sinal.</p><button onClick={() => { setQuery(""); setCategory("todos"); }}>LIMPAR BUSCA</button></div>}</div>
      </div>
    </section>
  );
}
