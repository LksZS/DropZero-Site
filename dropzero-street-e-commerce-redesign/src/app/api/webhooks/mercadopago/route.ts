import { db } from "@/db";
import { orders, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

function validSignature(signature: string, requestId: string, dataId: string, secret: string) {
  const parts = Object.fromEntries(signature.split(",").map((part) => { const [key, ...value] = part.trim().split("="); return [key, value.join("=")]; }));
  if (!parts.ts || !parts.v1) return false;
  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(parts.v1);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (!accessToken || !webhookSecret) return NextResponse.json({ error: "Webhook não configurado" }, { status: 503 });

  const url = new URL(request.url);
  const body = await request.json().catch(() => ({})) as { type?: string; action?: string; data?: { id?: string | number } };
  const dataId = String(url.searchParams.get("data.id") || body.data?.id || "");
  const signature = request.headers.get("x-signature") || "";
  const requestId = request.headers.get("x-request-id") || "";
  if (!dataId || !validSignature(signature, requestId, dataId, webhookSecret)) return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  if (body.type && body.type !== "payment" && !body.action?.startsWith("payment.")) return NextResponse.json({ received: true });

  const gatewayResponse = await fetch(`https://api.mercadopago.com/v1/payments/${encodeURIComponent(dataId)}`, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
  if (!gatewayResponse.ok) return NextResponse.json({ error: "Pagamento não encontrado no gateway" }, { status: 502 });
  const gatewayPayment = await gatewayResponse.json() as { id: number; status: string; status_detail?: string; external_reference?: string; transaction_amount?: number };
  const paymentStatus = gatewayPayment.status === "approved" ? "approved" : gatewayPayment.status === "refunded" ? "refunded" : ["rejected", "cancelled"].includes(gatewayPayment.status) ? "declined" : "pending";

  await db.transaction(async (tx) => {
    const [localPayment] = await tx.select({ orderId: payments.orderId, amountCents: payments.amountCents }).from(payments).where(eq(payments.gatewayPaymentId, String(gatewayPayment.id))).limit(1);
    if (!localPayment) return;
    if (gatewayPayment.transaction_amount && Math.round(gatewayPayment.transaction_amount * 100) !== localPayment.amountCents) throw new Error("Payment amount mismatch");
    await tx.update(payments).set({ status: paymentStatus, paidAt: paymentStatus === "approved" ? new Date() : null, updatedAt: new Date(), payload: { statusDetail: gatewayPayment.status_detail } }).where(eq(payments.gatewayPaymentId, String(gatewayPayment.id)));
    const orderStatus = paymentStatus === "approved" ? "paid" : paymentStatus === "refunded" ? "refunded" : paymentStatus === "declined" ? "cancelled" : "payment_pending";
    await tx.update(orders).set({ status: orderStatus, updatedAt: new Date() }).where(eq(orders.id, localPayment.orderId));
  });

  return NextResponse.json({ received: true });
}
