"use client";

import { formatBRL } from "@/lib/catalog";
import { ArrowUpRight, Minus, Plus, Ticket, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "./store-provider";

export function CartSheet() {
  const { cart, cartOpen, setCartOpen, removeItem, updateQuantity } = useStore();
  const [coupon, setCoupon] = useState("");
  const [couponStatus, setCouponStatus] = useState<"idle" | "valid" | "invalid">("idle");

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const discount = couponStatus === "valid" ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 300 || cart.length === 0 ? 0 : 19.9;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    setCouponStatus(coupon.trim().toUpperCase() === "DROPZERO10" ? "valid" : "invalid");
  };

  return (
    <>
      <button className={`drawer-backdrop ${cartOpen ? "is-open" : ""}`} aria-label="Fechar carrinho" onClick={() => setCartOpen(false)} />
      <aside className={`cart-sheet ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen}>
        <div className="receipt-tear" />
        <div className="cart-head">
          <div>
            <span className="eyebrow dark">DZ / ORDER SHEET</span>
            <h2>SEU CORRE</h2>
          </div>
          <button className="icon-button dark" aria-label="Fechar carrinho" onClick={() => setCartOpen(false)}><X /></button>
        </div>

        <div className="receipt-meta">
          <span>RECIBO #DZ-{String(cart.length).padStart(3, "0")}</span>
          <span>{new Date().toLocaleDateString("pt-BR")}</span>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <span>00 / NADA AQUI</span>
              <p>Sua bag está vazia. A rua não espera.</p>
              <button className="ink-link" onClick={() => setCartOpen(false)}>VOLTAR PRO DROP <ArrowUpRight /></button>
            </div>
          ) : cart.map((item) => (
            <article className="cart-line" key={`${item.product.id}-${item.size}-${item.color}`}>
              <img src={item.product.images[0]} alt={item.product.name} />
              <div className="cart-line-info">
                <span className="micro">{item.product.sku}</span>
                <strong>{item.product.shortName}</strong>
                <span>{item.color} / {item.size}</span>
                <div className="quantity-control">
                  <button aria-label="Diminuir quantidade" onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}><Minus /></button>
                  <span>{String(item.quantity).padStart(2, "0")}</span>
                  <button aria-label="Aumentar quantidade" onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}><Plus /></button>
                </div>
              </div>
              <div className="cart-line-end">
                <button aria-label="Remover produto" onClick={() => removeItem(item.product.id, item.size)}><Trash2 /></button>
                <strong>{formatBRL(item.product.price * item.quantity)}</strong>
              </div>
            </article>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="receipt-bottom">
            <div className="coupon-row">
              <Ticket />
              <input value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponStatus("idle"); }} placeholder="CÓDIGO / CUPOM" aria-label="Cupom" />
              <button onClick={applyCoupon}>APLICAR</button>
            </div>
            {couponStatus !== "idle" && <p className={`coupon-message ${couponStatus}`}>{couponStatus === "valid" ? "DROPZERO10 APLICADO / -10%" : "CÓDIGO NÃO ENCONTRADO"}</p>}
            <div className="receipt-totals">
              <div><span>SUBTOTAL</span><strong>{formatBRL(subtotal)}</strong></div>
              <div><span>DESCONTO</span><strong>- {formatBRL(discount)}</strong></div>
              <div><span>FRETE</span><strong>{shipping ? formatBRL(shipping) : "GRÁTIS"}</strong></div>
              <div className="receipt-total"><span>TOTAL</span><strong>{formatBRL(total)}</strong></div>
            </div>
            <Link href="/checkout" className="checkout-button" onClick={() => setCartOpen(false)}>
              FECHAR PEDIDO <ArrowUpRight />
            </Link>
            <p className="secure-note">PAGAMENTO PROCESSADO EM AMBIENTE SEGURO / SSL</p>
          </div>
        )}
      </aside>
    </>
  );
}
