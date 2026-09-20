import { CheckoutClient } from "@/components/checkout-client";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout seguro" };

export default function CheckoutPage() {
  return <main className="page-shell checkout-page"><CheckoutClient /></main>;
}
