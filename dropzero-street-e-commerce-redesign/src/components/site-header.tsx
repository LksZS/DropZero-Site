"use client";

import { products } from "@/lib/catalog";
import { ArrowUpRight, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "./store-provider";

const nav = [
  ["SHOP", "/shop"],
  ["DROPS", "/#drops"],
  ["CATEGORIAS", "/#categorias"],
  ["SOBRE", "/#manifesto"],
];

export function SiteHeader() {
  const { cartCount, setCartOpen, menuOpen, setMenuOpen, searchOpen, setSearchOpen } = useStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const results = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return products.slice(0, 4);
    return products.filter((product) => [product.name, product.categoryLabel, product.sku, product.dropName].join(" ").toLowerCase().includes(clean)).slice(0, 5);
  }, [query]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-code"><span>BR / SP</span><span>23°33&apos;S</span></div>
        <Link href="/" className="wordmark" aria-label="DropZero início"><span>DROP</span><span>ZERO</span></Link>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {nav.map(([label, href], index) => <Link href={href} key={label}><sup>0{index + 1}</sup>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button onClick={() => setSearchOpen(true)} aria-label="Abrir busca"><Search /><span>SEARCH</span></button>
          <Link href="/account" aria-label="Conta"><UserRound /><span>ACCOUNT</span></Link>
          <button onClick={() => setCartOpen(true)} aria-label={`Abrir bag com ${cartCount} itens`}><ShoppingBag /><span>BAG</span><b>{String(cartCount).padStart(2, "0")}</b></button>
          <button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu /></button>
        </div>
        <div className="header-ruler"><span /><i /><i /><i /><span /></div>
      </header>

      <div className={`search-layer ${searchOpen ? "is-open" : ""}`} aria-hidden={!searchOpen}>
        <div className="search-layer-head">
          <span>INDEX / BUSCA DE ARQUIVO</span>
          <button onClick={() => setSearchOpen(false)} aria-label="Fechar busca"><X /></button>
        </div>
        <div className="search-field">
          <Search />
          <input autoFocus={searchOpen} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="DIGITE O QUE PROCURA" aria-label="Buscar produtos" />
          <span>{String(results.length).padStart(2, "0")} RESULTADOS</span>
        </div>
        <div className="search-results-list">
          {results.map((product, index) => (
            <Link href={`/produto/${product.slug}`} onClick={() => setSearchOpen(false)} key={product.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <img src={product.images[0]} alt="" />
              <strong>{product.shortName}</strong>
              <small>{product.categoryLabel} / {product.drop}</small>
              <ArrowUpRight />
            </Link>
          ))}
          {results.length === 0 && <p className="no-results">NADA ENCONTRADO NO ARQUIVO.</p>}
        </div>
      </div>

      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-top"><span>DROPZERO / MENU</span><button onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div>
        <nav>
          {nav.map(([label, href], index) => (
            <Link href={href} onClick={() => setMenuOpen(false)} key={label}><sup>0{index + 1}</sup><span>{label}</span><ArrowUpRight /></Link>
          ))}
        </nav>
        <div className="mobile-menu-foot"><span>INDEPENDENT STREETWEAR</span><span>SÃO PAULO / BRASIL</span><span>EST. 2024</span></div>
      </div>
    </>
  );
}
