import { db } from "@/db";
import { orderItems, orders, payments } from "@/db/schema";
import { products as catalog } from "@/lib/catalog";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

type OrderRequest = {
  customer?: { name?: unknown; email?: unknown; document?: unknown };
  address?: Record<string, unknown>;
  method?: unknown;
  items?: Array<{ productId?: unknown; size?: unknown; color?: unknown; quantity?: unknown }>;
};

const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";

export async function POST(request: Request) {
  let body: OrderRequest;
  try { body = await request.json() as OrderRequest; }
  catch { return NextResponse.json({ error: "REQUISIÇÃO INVÁLIDA." }, { status: 400 }); }

  const customer = { name: clean(body.customer?.name), email: clean(body.customer?.email), document: clean(body.customer?.document).replace(/\D/g, "") };
  const address = {
    postalCode: clean(body.address?.postalCode).replace(/\D/g, ""), street: clean(body.address?.street), number: clean(body.address?.number),
    complement: clean(body.address?.complement), district: clean(body.address?.district), city: clean(body.address?.city), state: clean(body.address?.state).toUpperCase(),
  };
  const method = body.method === "card" || body.method === "boleto" ? body.method : "pix";

  if (!customer.name || !customer.email.includes("@") || customer.document.length !== 11 || !address.postalCode || !address.street || !address.number || !address.district || !address.city || address.state.length !== 2) {
    return NextResponse.json({ error: "REVISE SEUS DADOS E ENDEREÇO." }, { status: 422 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) return NextResponse.json({ error: "A BAG ESTÁ VAZIA." }, { status: 422 });

  const normalized = body.items.map((item) => {
    const product = catalog.find((entry) => entry.id === clean(item.productId));
    const quantity = Math.max(1, Math.min(10, Number(item.quantity) || 1));
    const size = clean(item.size);
    const color = clean(item.color);
    if (!product || !product.sizes.includes(size) || !product.colors.includes(color) || product.stock < quantity) return null;
    return { product, quantity, size, color, totalCents: Math.round(product.price * 100) * quantity };
  });
  if (normalized.some((item) => !item)) return NextResponse.json({ error: "UM ITEM MUDOU DE PREÇO OU ESTOQUE. REVISE A BAG." }, { status: 409 });
  const validItems = normalized.filter((item): item is NonNullable<typeof item> => item !== null);
  const subtotalCents = validItems.reduce((sum, item) => sum + item.totalCents, 0);
  const shippingCents = subtotalCents >= 30000 ? 0 : 1990;
  const totalCents = subtotalCents + shippingCents;
  const orderNumber = `DZ-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  const created = await db.transaction(async (tx) => {
    const [order] = await tx.insert(orders).values({
      number: orderNumber, customerEmail: customer.email, customerName: customer.name, customerDocument: customer.document,
      subtotalCents, shippingCents, totalCents, shippingAddress: address,
    }).returning({ id: orders.id, number: orders.number });
    await tx.insert(orderItems).values(validItems.map(({ product, quantity, size, color, totalCents: itemTotal }) => ({
      orderId: order.id, productName: product.name, sku: product.sku, size, color, quantity,
      unitPriceCents: Math.round(product.price * 100), totalCents: itemTotal,
    })));
    return order;
  });

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  if (!accessToken) {
    await db.insert(payments).values({ orderId: created.id, gateway: "mercado_pago", method, amountCents: totalCents, payload: { configuration: "pending" } });
    return NextResponse.json({ orderNumber: created.number, status: "payment_pending", message: "PEDIDO REGISTRADO. O GATEWAY AGUARDA CONFIGURAÇÃO PARA EMITIR A COBRANÇA." }, { status: 201 });
  }

  const idempotencyKey = randomUUID();
  const commonHeaders = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", "X-Idempotency-Key": idempotencyKey };

  try {
    if (method === "card") {
      const gatewayResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST", headers: commonHeaders, body: JSON.stringify({
          external_reference: created.number,
          items: validItems.map(({ product, quantity, size }) => ({ id: product.id, title: `${product.name} / ${size}`, quantity, currency_id: "BRL", unit_price: product.price })),
          payer: { name: customer.name, email: customer.email },
          back_urls: { success: `${siteUrl}/account?payment=approved`, pending: `${siteUrl}/account?payment=pending`, failure: `${siteUrl}/checkout?payment=failure` },
          auto_return: "approved", notification_url: `${siteUrl}/api/webhooks/mercadopago`,
        }),
      });
      const gateway = await gatewayResponse.json() as { id?: string; init_point?: string; message?: string };
      if (!gatewayResponse.ok || !gateway.id || !gateway.init_point) throw new Error(gateway.message || "Falha ao criar checkout");
      await db.insert(payments).values({ orderId: created.id, gateway: "mercado_pago", gatewayPaymentId: gateway.id, method, amountCents: totalCents, payload: { preferenceId: gateway.id } });
      return NextResponse.json({ orderNumber: created.number, status: "payment_pending", paymentUrl: gateway.init_point }, { status: 201 });
    }

    const paymentBody = {
      transaction_amount: totalCents / 100, description: `DropZero ${created.number}`, external_reference: created.number,
      payment_method_id: method === "pix" ? "pix" : "bolbradesco", notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      payer: { email: customer.email, first_name: customer.name.split(" ")[0], last_name: customer.name.split(" ").slice(1).join(" "), identification: { type: "CPF", number: customer.document }, address: { zip_code: address.postalCode, street_name: address.street, street_number: address.number, neighborhood: address.district, city: address.city, federal_unit: address.state } },
    };
    const gatewayResponse = await fetch("https://api.mercadopago.com/v1/payments", { method: "POST", headers: commonHeaders, body: JSON.stringify(paymentBody) });
    const gateway = await gatewayResponse.json() as { id?: number; status?: string; status_detail?: string; message?: string; point_of_interaction?: { transaction_data?: { qr_code?: string; qr_code_base64?: string; ticket_url?: string } }; transaction_details?: { external_resource_url?: string } };
    if (!gatewayResponse.ok || !gateway.id) throw new Error(gateway.message || "Falha ao gerar cobrança");
    const transaction = gateway.point_of_interaction?.transaction_data;
    await db.insert(payments).values({ orderId: created.id, gateway: "mercado_pago", gatewayPaymentId: String(gateway.id), method, amountCents: totalCents, payload: { statusDetail: gateway.status_detail, ticketUrl: transaction?.ticket_url || gateway.transaction_details?.external_resource_url } });
    return NextResponse.json({ orderNumber: created.number, status: gateway.status || "pending", qrCode: transaction?.qr_code, qrCodeBase64: transaction?.qr_code_base64, paymentUrl: method === "boleto" ? gateway.transaction_details?.external_resource_url : undefined, message: method === "pix" ? "PIX GERADO. A APROVAÇÃO SERÁ CONFIRMADA PELO WEBHOOK." : "BOLETO EMITIDO PELO GATEWAY." }, { status: 201 });
  } catch (error) {
    await db.insert(payments).values({ orderId: created.id, gateway: "mercado_pago", method, amountCents: totalCents, payload: { error: error instanceof Error ? error.message : "gateway_error" } });
    return NextResponse.json({ error: "PEDIDO REGISTRADO, MAS O GATEWAY NÃO RESPONDEU. TENTE NOVAMENTE NA ÁREA DO CLIENTE.", orderNumber: created.number }, { status: 502 });
  }
}
