"use client";

import type { CatalogProduct } from "@/lib/catalog";
import { formatBRL } from "@/lib/catalog";
import { ArrowRight, Heart, Minus, Plus, Ruler, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { useStore } from "./store-provider";

export function ProductDetails({ product }: { product: CatalogProduct }) {
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState("details");
  const { addItem, favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(product.id);

  const addSelected = () => {
    for (let index = 0; index < quantity; index += 1) addItem(product, size, color);
  };

  return (
    <div className="product-detail-layout">
      <div className="product-gallery">
        <div className="gallery-main">
          <img src={product.images[activeImage]} alt={`${product.name}, vista ${activeImage + 1}`} />
          <span className="gallery-counter">{String(activeImage + 1).padStart(2, "0")} / {String(product.images.length).padStart(2, "0")}</span>
          <span className="gallery-sku">IMAGE ARCHIVE / {product.sku}</span>
        </div>
        <div className="gallery-thumbs">
          {product.images.map((image, index) => <button className={activeImage === index ? "active" : ""} onClick={() => setActiveImage(index)} key={image}><img src={image} alt={`Selecionar vista ${index + 1}`} /></button>)}
        </div>
      </div>

      <aside className="product-buy-panel">
        <div className="product-breadcrumb">SHOP / {product.categoryLabel} / {product.drop}</div>
        <div className="buy-heading">
          <span className={product.stock > 5 ? "stock-ok" : product.stock > 0 ? "stock-low" : "stock-out"}>{product.stock > 5 ? "DISPONÍVEL" : product.stock > 0 ? `BAIXO / ${product.stock} RESTANTES` : "ESGOTADO"}</span>
          {product.limited && <b>LIMITED ISSUE</b>}
        </div>
        <h1>{product.shortName}</h1>
        <p className="product-fullname">{product.name}</p>
        <div className="detail-price"><strong>{formatBRL(product.price)}</strong>{product.oldPrice && <del>{formatBRL(product.oldPrice)}</del>}<small>OU 3X DE {formatBRL(product.price / 3)} SEM JUROS</small></div>

        <div className="option-block">
          <div className="option-label"><span>COR / {color}</span><span>0{product.colors.indexOf(color) + 1}</span></div>
          <div className="color-options">{product.colors.map((item) => <button className={color === item ? "active" : ""} onClick={() => setColor(item)} key={item}><i className={item.toLowerCase().includes("preto") || item === "CARVÃO" || item === "ASFALTO" ? "swatch-black" : item === "OLIVA" ? "swatch-olive" : "swatch-paper"} />{item}</button>)}</div>
        </div>

        <div className="option-block">
          <div className="option-label"><span>TAMANHO / {size}</span><button><Ruler /> GUIA DE MEDIDAS</button></div>
          <div className="size-options">{product.sizes.map((item) => <button className={size === item ? "active" : ""} onClick={() => setSize(item)} key={item}>{item}</button>)}</div>
        </div>

        <div className="buy-actions">
          <div className="detail-quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Diminuir"><Minus /></button><span>{String(quantity).padStart(2, "0")}</span><button onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))} aria-label="Aumentar"><Plus /></button></div>
          <button className="add-bag-main" disabled={product.stock === 0} onClick={addSelected}>{product.stock === 0 ? "FORA DE ESTOQUE" : "ADICIONAR À BAG"}<ArrowRight /></button>
          <button className={`detail-favorite ${isFavorite ? "active" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label="Favoritar"><Heart /></button>
        </div>

        <div className="buy-benefits"><div><Truck /><span>ENVIO EM ATÉ 2 DIAS ÚTEIS</span></div><div><ShieldCheck /><span>TROCA FÁCIL / 30 DIAS</span></div></div>

        <div className="product-accordions">
          {[
            ["details", "DETALHES", product.description],
            ["composition", "COMPOSIÇÃO", product.composition],
            ["shipping", "ENTREGA & TROCA", "Frete calculado no checkout. Primeira troca gratuita em até 30 dias após o recebimento."],
          ].map(([id, label, content]) => <div className={openSection === id ? "open" : ""} key={id}><button onClick={() => setOpenSection(openSection === id ? "" : id)}><span>{label}</span><Plus /></button><p>{content}</p></div>)}
        </div>

        <div className="product-tech"><span>SKU / {product.sku}</span><span>{product.drop} / {product.dropName}</span><span>STOCK / {String(product.stock).padStart(3, "0")}</span></div>
      </aside>
    </div>
  );
}
