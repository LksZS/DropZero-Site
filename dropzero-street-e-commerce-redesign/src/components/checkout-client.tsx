"use client";

import { formatBRL } from "@/lib/catalog";
import { ArrowLeft, ArrowRight, Banknote, Check, Copy, CreditCard, LockKeyhole, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useStore } from "./store-provider";

type CheckoutResult = { orderNumber: string; status: string; qrCode?: string; qrCodeBase64?: string; paymentUrl?: string; message?: string };

export function CheckoutClient() {
  const { cart, clearCart } = useStore();
  const [method, setMethod] = useState<"pix" | "card" | "boleto">("pix");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const shipping = subtotal >= 300 ? 0 : 19.9;
  const total = subtotal + shipping;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      customer: { name: data.get("name"), email: data.get("email"), document: data.get("document") },
      address: { postalCode: data.get("postalCode"), street: data.get("street"), number: data.get("number"), complement: data.get("complement"), district: data.get("district"), city: data.get("city"), state: data.get("state") },
      method,
      items: cart.map((item) => ({ productId: item.product.id, size: item.size, color: item.color, quantity: item.quantity })),
    }) });
    const payload = await response.json() as CheckoutResult & { error?: string };
    if (!response.ok) { setError(payload.error || "NÃO FOI POSSÍVEL FECHAR O PEDIDO."); setLoading(false); return; }
    if (payload.paymentUrl) { window.location.assign(payload.paymentUrl); return; }
    setResult(payload); clearCart(); setLoading(false);
  };

  if (result) return <section className="checkout-success"><div className="success-stamp"><Check /></div><span>ORDER / {result.orderNumber}</span><h1>PEDIDO<br />NA RUA.</h1><p>{result.message || "Pedido registrado. A confirmação chega assim que o gateway aprovar o pagamento."}</p>{result.qrCodeBase64 && <img className="pix-code" src={`data:image/png;base64,${result.qrCodeBase64}`} alt="QR Code Pix" />}{result.qrCode && <button className="copy-pix" onClick={() => navigator.clipboard.writeText(result.qrCode || "")}><Copy /> COPIAR PIX</button>}<Link href="/account">ACOMPANHAR PEDIDO <ArrowRight /></Link></section>;

  if (cart.length === 0) return <section className="checkout-empty"><span>ORDER SHEET / 000</span><h1>SUA BAG<br />ESTÁ VAZIA.</h1><Link href="/shop"><ArrowLeft /> VOLTAR PRO SHOP</Link></section>;

  return (
    <div className="checkout-layout">
      <section className="checkout-form-side">
        <Link href="/shop" className="checkout-back"><ArrowLeft /> CONTINUAR COMPRANDO</Link>
        <div className="checkout-steps"><div className="active"><b>01</b><span>DADOS</span></div><i /><div className="active"><b>02</b><span>ENTREGA</span></div><i /><div className="active"><b>03</b><span>PAGAMENTO</span></div><i /><div><b>04</b><span>CONFIRMAÇÃO</span></div></div>
        <form onSubmit={submit} className="checkout-form">
          <fieldset><legend><small>01 / IDENTIFICAÇÃO</small><strong>QUEM RECEBE?</strong></legend><div className="form-grid"><label className="wide"><span>NOME COMPLETO</span><input name="name" required /></label><label><span>E-MAIL</span><input name="email" type="email" required /></label><label><span>CPF</span><input name="document" inputMode="numeric" required placeholder="000.000.000-00" /></label></div></fieldset>
          <fieldset><legend><small>02 / ROTA</small><strong>ONDE ENTREGA?</strong></legend><div className="form-grid"><label><span>CEP</span><input name="postalCode" required inputMode="numeric" /></label><label className="wide"><span>RUA / AVENIDA</span><input name="street" required /></label><label><span>NÚMERO</span><input name="number" required /></label><label><span>COMPLEMENTO</span><input name="complement" /></label><label><span>BAIRRO</span><input name="district" required /></label><label><span>CIDADE</span><input name="city" required /></label><label><span>UF</span><input name="state" maxLength={2} required /></label></div></fieldset>
          <fieldset><legend><small>03 / PAGAMENTO SEGURO</small><strong>COMO VAI SER?</strong></legend><div className="payment-methods"><button type="button" className={method === "pix" ? "active" : ""} onClick={() => setMethod("pix")}><QrCode /><span><b>PIX</b><small>APROVAÇÃO IMEDIATA</small></span></button><button type="button" className={method === "card" ? "active" : ""} onClick={() => setMethod("card")}><CreditCard /><span><b>CARTÃO</b><small>AMBIENTE MERCADO PAGO</small></span></button><button type="button" className={method === "boleto" ? "active" : ""} onClick={() => setMethod("boleto")}><Banknote /><span><b>BOLETO</b><small>ATÉ 3 DIAS ÚTEIS</small></span></button></div><div className="payment-security"><LockKeyhole /><p>{method === "card" ? "Você será direcionado ao ambiente seguro do gateway. A DropZero nunca recebe ou armazena os dados do seu cartão." : method === "pix" ? "O QR Code será gerado diretamente pelo gateway após a criação segura do pedido." : "O boleto será emitido pelo gateway e vinculado ao seu pedido."}</p></div></fieldset>
          {error && <p className="checkout-error">{error}</p>}
          <button className="place-order" disabled={loading}>{loading ? "ENVIANDO AO GATEWAY..." : `PAGAR ${formatBRL(total)}`}<ArrowRight /></button>
          <div className="checkout-trust"><ShieldCheck /><span>SSL / DADOS CRIPTOGRAFADOS</span><span>LGPD / AMBIENTE SEGURO</span></div>
        </form>
      </section>
      <aside className="order-summary"><div className="summary-head"><span>DZ / STREET RECEIPT</span><strong>SEU PEDIDO</strong><small>{String(cart.length).padStart(2, "0")} ITENS</small></div><div className="summary-items">{cart.map((item) => <div key={`${item.product.id}-${item.size}`}><img src={item.product.images[0]} alt="" /><span><b>{item.product.shortName}</b><small>{item.color} / {item.size} / QTY {item.quantity}</small></span><strong>{formatBRL(item.product.price * item.quantity)}</strong></div>)}</div><div className="summary-values"><div><span>SUBTOTAL</span><b>{formatBRL(subtotal)}</b></div><div><span>ENTREGA</span><b>{shipping ? formatBRL(shipping) : "GRÁTIS"}</b></div><div className="summary-total"><span>TOTAL</span><b>{formatBRL(total)}</b></div></div><p>ORDER ID GENERATED ON SUBMIT<br />PRICES IN BRL / TAX INCLUDED</p></aside>
    </div>
  );
}
